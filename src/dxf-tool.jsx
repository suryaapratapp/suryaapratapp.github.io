import React, { useMemo, useRef, useState } from "react";
import { extractPdfGeometry, makeDxf } from "./dxf-converter.js";
import { inferDrawingScale } from "./dxf-scale.js";
import { readOutlinedText } from "./dxf-ocr.js";

const distanceToSegment = (point, start, end) => {
    const dx = end[0] - start[0], dy = end[1] - start[1];
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared ? Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared)) : 0;
    return Math.hypot(point[0] - start[0] - t * dx, point[1] - start[1] - t * dy);
};

const touchedByBrush = (entity, point, radius) => {
    const [x0, y0, x1, y1] = entity.bounds;
    if (point[0] < x0 - radius || point[0] > x1 + radius || point[1] < y0 - radius || point[1] > y1 + radius) return false;
    return entity.points.some((vertex, index) => index && distanceToSegment(point, entity.points[index - 1], vertex) <= radius);
};

const initialOptions = { removeText: false, removeDimensions: true, removeCentreLines: true, removeFrame: false };

const withFilters = (drawing, options) => drawing.entities.map(entity => {
    const [x0, y0, x1, y1] = entity.bounds;
    const inMargin = x1 < drawing.width * 0.08 || x0 > drawing.width * 0.92 || y1 < drawing.height * 0.16;
    const filtered = (options.removeText && entity.textCandidate) ||
        (options.removeDimensions && entity.kind === "dimension") ||
        (options.removeCentreLines && entity.kind === "centreline") ||
        (options.removeFrame && (inMargin || entity.kind === "reference"));
    return { ...entity, visible: !filtered };
});

const pathFor = (points, height) => points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)} ${(height - point[1]).toFixed(2)}`).join(" ");

export default function DxfTool() {
    const [file, setFile] = useState(null);
    const [options, setOptions] = useState(initialOptions);
    const [pageNumber, setPageNumber] = useState(1);
    const [drawing, setDrawing] = useState(null);
    const [removedIds, setRemovedIds] = useState(() => new Set());
    const [mode, setMode] = useState("brush");
    const [brushRadius, setBrushRadius] = useState(8);
    const [calibration, setCalibration] = useState([]);
    const [knownMm, setKnownMm] = useState("");
    const [detectedScale, setDetectedScale] = useState(null);
    const [useManual, setUseManual] = useState(false);
    const [scaleConfirmed, setScaleConfirmed] = useState(false);
    const [focusPart, setFocusPart] = useState(false);
    const [undoStack, setUndoStack] = useState([]);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [box, setBox] = useState(null);
    const svgRef = useRef(null);
    const dragging = useRef(false);
    const analysisId = useRef(0);
    const entities = useMemo(() => drawing ? withFilters(drawing, options).map(entity => ({ ...entity, visible: entity.visible && !removedIds.has(entity.id) })) : [], [drawing, options, removedIds]);
    const visibleCount = entities.filter(entity => entity.visible).length;
    const calibrationSpan = calibration.length === 2 ? Math.hypot(calibration[1][0] - calibration[0][0], calibration[1][1] - calibration[0][1]) : 0;
    const manualScale = calibrationSpan > 0 && Number(knownMm) > 0 ? Number(knownMm) / calibrationSpan : 0;
    const scale = useManual ? manualScale : detectedScale?.scale || 0;

    const convert = async (nextFile = file, nextPage = pageNumber) => {
        if (!nextFile) return setMessage("Choose a PDF drawing first.");
        if (!window.pdfjsLib) return setMessage("PDF reader is unavailable. Reload the admin tool and try again.");
        const request = ++analysisId.current;
        setBusy(true);
        setMessage("Reading the drawing and looking for dimensions…");
        setDrawing(null);
        setDetectedScale(null);
        setUseManual(false);
        setMode("brush");
        setFocusPart(false);
        setScaleConfirmed(false);
        setCalibration([]);
        setKnownMm("");
        setRemovedIds(new Set());
        setUndoStack([]);
        setBox(null);
        try {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            const result = await extractPdfGeometry(window.pdfjsLib, nextFile, nextPage);
            if (request !== analysisId.current) return;
            if (!result.entities.length) throw new Error("No vector paths found. Scanned drawings need a separate tracing step before a reliable DXF can be made.");
            setDrawing(result);
            setPageNumber(nextPage);
            let match = inferDrawingScale(result.text, result.entities, result.width, result.height);
            let source = "drawing text";
            if (!match) {
                setMessage("Reading outlined drawing labels on your device. This can take a little time on the first use…");
                try {
                    const text = await readOutlinedText(window.pdfjsLib, nextFile, nextPage, progress => {
                        if (request === analysisId.current) setMessage(`Reading outlined drawing labels on your device… ${progress}%`);
                    });
                    if (request !== analysisId.current) return;
                    match = inferDrawingScale(`${result.text}\n${text}`, result.entities, result.width, result.height);
                    source = "recognised drawing text";
                } catch (error) {
                    if (request !== analysisId.current) return;
                    console.warn("Automatic drawing text recognition failed", error);
                }
            }
            if (request !== analysisId.current) return;
            if (match) {
                setDetectedScale({ ...match, source });
                setFocusPart(true);
                setMessage(`Suggested scale found from ${match.label} mm and the matching part outline. Check the indicated size before export.`);
            } else {
                setFocusPart(false);
                setUseManual(true);
                setMode("calibrate");
                setMessage("Could not determine a reliable scale automatically. Select two points on a known length and enter its actual size.");
            }
        } catch (error) { if (request === analysisId.current) setMessage(error.message || "Could not read this PDF drawing."); }
        finally { if (request === analysisId.current) setBusy(false); }
    };

    const pointFromEvent = event => {
        const svg = svgRef.current;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const local = point.matrixTransform(svg.getScreenCTM().inverse());
        return [local.x, drawing.height - local.y];
    };

    const brushAt = point => setRemovedIds(current => {
        const next = new Set(current);
        entities.forEach(entity => { if (entity.visible && touchedByBrush(entity, point, Number(brushRadius))) next.add(entity.id); });
        return next;
    });
    const pointerDown = event => {
        if (!drawing) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const point = pointFromEvent(event);
        if (mode === "calibrate") {
            setCalibration(current => current.length === 2 ? [point] : [...current, point]);
            setScaleConfirmed(false);
            return;
        }
        setUndoStack(current => [...current.slice(-19), new Set(removedIds)]);
        dragging.current = true;
        if (mode === "brush") brushAt(point);
        else setBox({ start: point, end: point });
    };
    const pointerMove = event => {
        if (!dragging.current || !drawing) return;
        const point = pointFromEvent(event);
        if (mode === "brush") brushAt(point);
        else setBox(current => current && { ...current, end: point });
    };
    const pointerUp = () => {
        dragging.current = false;
        if (box) {
            const x0 = Math.min(box.start[0], box.end[0]), x1 = Math.max(box.start[0], box.end[0]);
            const y0 = Math.min(box.start[1], box.end[1]), y1 = Math.max(box.start[1], box.end[1]);
            if (x1 - x0 > 2 && y1 - y0 > 2) setRemovedIds(current => {
                const next = new Set(current);
                entities.forEach(entity => {
                    const [a, b, c, d] = entity.bounds;
                    const inside = a >= x0 && c <= x1 && b >= y0 && d <= y1;
                    if (entity.visible && (mode === "keep-box" ? !inside : inside)) next.add(entity.id);
                });
                return next;
            });
            setBox(null);
        }
    };

    const download = () => {
        try {
            if (!scaleConfirmed) throw new Error("Confirm the drawing size before downloading.");
            const visible = entities.filter(entity => entity.visible);
            const origin = visible.reduce((minimum, entity) => [Math.min(minimum[0], entity.bounds[0]), Math.min(minimum[1], entity.bounds[1])], [Infinity, Infinity]);
            const data = makeDxf(entities, scale, origin);
            const url = URL.createObjectURL(new Blob([data], { type: "application/dxf" }));
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${file.name.replace(/\.pdf$/i, "")}-page-${pageNumber}-reviewed.dxf`;
            anchor.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) { setMessage(error.message); }
    };

    const focusBounds = detectedScale?.bounds;
    const padding = focusBounds ? Math.max(focusBounds[2] - focusBounds[0], focusBounds[3] - focusBounds[1]) * 0.08 : 0;
    const viewBox = drawing && focusPart && focusBounds
        ? `${focusBounds[0] - padding} ${drawing.height - focusBounds[3] - padding} ${focusBounds[2] - focusBounds[0] + 2 * padding} ${focusBounds[3] - focusBounds[1] + 2 * padding}`
        : drawing ? `0 0 ${drawing.width} ${drawing.height}` : "0 0 1 1";

    return <div className="min-h-screen bg-slate-100 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-600">Admin drawing tool</p><h2 className="mt-2 text-3xl font-extrabold text-slate-950">PDF to DXF</h2><p className="mt-2 max-w-3xl text-sm text-slate-600">Upload a vector drawing. We’ll look for an overall length × width in millimetres, suggest a scale, and help you clean the geometry before export.</p></div>
            <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
                <div className="space-y-5">
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">1. Upload a drawing</h3>
                        <input aria-label="Upload PDF drawing" type="file" accept="application/pdf,.pdf" onChange={event => { const selected = event.target.files?.[0]; if (selected) { setFile(selected); convert(selected, 1); } }} className="mt-4 w-full text-sm" />
                        <p className="mt-3 text-xs leading-relaxed text-slate-500">Analysis starts automatically. Your drawing stays on this device; text-recognition files may be downloaded on first use.</p>
                        {drawing && <label className="mt-4 block text-xs font-bold">PDF page <select disabled={busy} value={pageNumber} onChange={event => convert(file, Number(event.target.value))} className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-2">{Array.from({ length: drawing.pageCount }, (_, index) => <option key={index} value={index + 1}>Page {index + 1}</option>)}</select></label>}
                    </section>
                    {drawing && <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">2. Review scale</h3>
                        {busy ? <p className="mt-3 text-sm text-slate-600">Analysing drawing dimensions…</p> : !useManual && detectedScale ? <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3"><p className="text-sm font-extrabold text-emerald-900">Suggested automatically</p><p className="mt-1 text-xs leading-relaxed text-emerald-900">{detectedScale.actualW} × {detectedScale.actualH} mm matches the main outline in both directions. Source: {detectedScale.source} ({detectedScale.label} mm).</p><p className="mt-2 text-xs text-emerald-800">Scale: {detectedScale.scale.toFixed(4)} mm per PDF point</p></div> : <><p className="mt-3 text-xs leading-relaxed text-slate-600">Select two endpoints of a known length in the preview, then enter its actual size in millimetres.</p><button type="button" onClick={() => setMode("calibrate")} className={`mt-3 w-full rounded border px-3 py-2 text-xs font-bold ${mode === "calibrate" ? "border-blue-700 bg-blue-50 text-blue-700" : "border-slate-300"}`}>Select two points</button><input type="number" min="0.001" step="any" value={knownMm} onChange={event => { setKnownMm(event.target.value); setScaleConfirmed(false); }} placeholder="Actual length in mm" aria-label="Known distance in millimetres" className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm" /><p className="mt-2 text-xs text-slate-500">{calibration.length}/2 points selected{manualScale ? ` · ${manualScale.toFixed(4)} mm per PDF point` : ""}</p></>}
                        {!busy && <div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => { setUseManual(true); setMode("calibrate"); setScaleConfirmed(false); }} className="text-xs font-bold text-blue-700 underline">Set scale manually</button>{detectedScale && useManual && <button type="button" onClick={() => { setUseManual(false); setScaleConfirmed(false); setMode("brush"); }} className="text-xs font-bold text-blue-700 underline">Use suggested scale</button>}</div>}
                        {!!scale && !busy && <label className="mt-4 flex items-start gap-2 text-xs font-bold leading-relaxed text-slate-700"><input type="checkbox" checked={scaleConfirmed} onChange={event => setScaleConfirmed(event.target.checked)} className="mt-0.5" /><span>I checked the size against the drawing.</span></label>}
                    </section>}
                    {drawing && <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">3. Clean the preview</h3>
                        <p className="mt-3 text-xs font-bold text-slate-600">Show or hide detected categories</p>
                        {[
                            ["removeText", "Hide small outlines (may include holes)"], ["removeDimensions", "Hide blue dimension paths"],
                            ["removeCentreLines", "Hide red centre lines"], ["removeFrame", "Hide paths near page edges"]
                        ].map(([key, label]) => <label key={key} className="mt-2 flex items-start gap-2 text-xs text-slate-700"><input type="checkbox" checked={options[key]} onChange={event => setOptions(current => ({ ...current, [key]: event.target.checked }))} className="mt-0.5" /><span>{label}</span></label>)}
                        <p className="mt-4 text-xs font-bold text-slate-600">Remove unwanted paths</p>
                        <div className="mt-2 grid grid-cols-2 gap-2">{[["brush", "Brush remove"], ["remove-box", "Remove box"], ["keep-box", "Keep box"]].map(([value, label]) => <button key={value} type="button" onClick={() => setMode(value)} className={`rounded border px-2 py-2 text-xs font-bold ${mode === value ? "border-blue-700 bg-blue-50 text-blue-700" : "border-slate-300"}`}>{label}</button>)}</div>
                        {detectedScale && <button type="button" onClick={() => { setUndoStack(current => [...current.slice(-19), new Set(removedIds)]); setRemovedIds(current => { const next = new Set(current); const [x0, y0, x1, y1] = detectedScale.bounds; entities.forEach(entity => { const [a, b, c, d] = entity.bounds; if (entity.visible && (a < x0 - 1 || b < y0 - 1 || c > x1 + 1 || d > y1 + 1)) next.add(entity.id); }); return next; }); }} className="mt-2 w-full rounded border border-slate-300 px-2 py-2 text-xs font-bold hover:bg-slate-50">Keep only detected main part</button>}
                        {mode === "brush" && <label className="mt-3 block text-xs">Brush size <input type="range" min="2" max="30" value={brushRadius} onChange={event => setBrushRadius(event.target.value)} className="w-full" /></label>}
                        <div className="mt-3 flex gap-2"><button type="button" disabled={!undoStack.length} onClick={() => { setRemovedIds(undoStack.at(-1)); setUndoStack(current => current.slice(0, -1)); }} className="rounded border border-slate-300 px-3 py-2 text-xs font-bold disabled:opacity-40">Undo</button><button type="button" onClick={() => { setRemovedIds(new Set()); setUndoStack([]); }} className="rounded border border-slate-300 px-3 py-2 text-xs font-bold">Restore removed</button></div>
                        <p className="mt-3 text-xs text-slate-500">{visibleCount} of {entities.length} paths kept. Brush and box tools remove whole vector paths, not pixels.</p>
                        <button type="button" disabled={busy || !scale || !scaleConfirmed || !visibleCount} onClick={download} className="mt-4 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-40">Download DXF</button>
                    </section>}
                </div>
                <section className="min-h-[480px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h3 className="font-extrabold">DXF geometry preview</h3>{drawing && <div className="flex items-center gap-3"><span className="text-xs text-slate-500">Page {pageNumber} of {drawing.pageCount}</span>{detectedScale && <button type="button" onClick={() => setFocusPart(!focusPart)} className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold">{focusPart ? "Show full page" : "Focus main part"}</button>}</div>}</div>
                    {drawing ? <div className="overflow-auto rounded border border-slate-200 bg-slate-50"><svg ref={svgRef} viewBox={viewBox} className="dxf-preview-svg w-full" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
                        <rect x="0" y="0" width={drawing.width} height={drawing.height} fill="white" />
                        {entities.filter(entity => entity.visible).map(entity => <path key={entity.id} d={pathFor(entity.points, drawing.height)} fill="none" stroke={entity.kind === "geometry" ? "#102a43" : entity.kind === "dimension" ? "#315ee8" : entity.kind === "centreline" ? "#d65b3b" : "#94a3b8"} strokeWidth="0.75" vectorEffect="non-scaling-stroke" />)}
                        {calibration.map((point, index) => <circle key={index} cx={point[0]} cy={drawing.height - point[1]} r="3" fill="#e11d48" />)}
                        {calibration.length === 2 && <line x1={calibration[0][0]} y1={drawing.height - calibration[0][1]} x2={calibration[1][0]} y2={drawing.height - calibration[1][1]} stroke="#e11d48" strokeWidth="1.5" />}
                        {box && <rect x={Math.min(box.start[0], box.end[0])} y={drawing.height - Math.max(box.start[1], box.end[1])} width={Math.abs(box.end[0] - box.start[0])} height={Math.abs(box.end[1] - box.start[1])} fill="#3b82f633" stroke="#2563eb" />}
                    </svg></div> : <div className="flex min-h-[420px] items-center justify-center rounded border border-dashed border-slate-300 text-sm text-slate-500">Upload a vector PDF to see its geometry here.</div>}
                    {message && <p role="status" className="mt-3 text-sm text-slate-700">{message}</p>}
                    {drawing && focusPart && <p className="mt-2 text-xs text-slate-500">Focused view only: other kept paths are still included in the DXF. Use “Keep only detected main part” to remove them.</p>}
                    <p className="mt-3 text-xs text-slate-500">Outlined labels can remain as paths; remove them in the preview. Check dimensions, holes, open contours and scale in CAD before cutting. Scanned pages need a separate tracing step.</p>
                </section>
            </div>
        </div>
    </div>;
}

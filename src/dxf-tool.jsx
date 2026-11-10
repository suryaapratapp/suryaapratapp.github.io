import React, { useRef, useState } from "react";
import { extractPdfGeometry, makeDxf } from "./dxf-converter.js";

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

const initialOptions = { removeText: true, removeDimensions: true, removeCentreLines: true, removeFrame: true };

const withFilters = (drawing, options) => drawing.entities.map(entity => {
    const [x0, y0, x1, y1] = entity.bounds;
    const inMargin = x1 < drawing.width * 0.08 || x0 > drawing.width * 0.92 || y1 < drawing.height * 0.16;
    const filtered = (options.removeText && entity.textCandidate) ||
        (options.removeDimensions && entity.kind === "dimension") ||
        (options.removeCentreLines && entity.kind === "centreline") ||
        (options.removeFrame && inMargin) || entity.kind === "reference";
    return { ...entity, visible: !filtered };
});

const pathFor = (points, height) => points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)} ${(height - point[1]).toFixed(2)}`).join(" ");

export default function DxfTool() {
    const [file, setFile] = useState(null);
    const [options, setOptions] = useState(initialOptions);
    const [pageNumber, setPageNumber] = useState(1);
    const [drawing, setDrawing] = useState(null);
    const [entities, setEntities] = useState([]);
    const [mode, setMode] = useState("brush");
    const [brushRadius, setBrushRadius] = useState(8);
    const [calibration, setCalibration] = useState([]);
    const [knownMm, setKnownMm] = useState("");
    const [undoStack, setUndoStack] = useState([]);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [box, setBox] = useState(null);
    const svgRef = useRef(null);
    const dragging = useRef(false);
    const visibleCount = entities.filter(entity => entity.visible).length;
    const calibrationSpan = calibration.length === 2 ? Math.hypot(calibration[1][0] - calibration[0][0], calibration[1][1] - calibration[0][1]) : 0;
    const scale = calibrationSpan > 0 && Number(knownMm) > 0 ? Number(knownMm) / calibrationSpan : 0;

    const convert = async (nextPage = pageNumber, nextOptions = options) => {
        if (!file) return setMessage("Choose a PDF drawing first.");
        if (!window.pdfjsLib) return setMessage("PDF reader is unavailable. Reload the admin tool and try again.");
        setBusy(true);
        setMessage("");
        try {
            const result = await extractPdfGeometry(window.pdfjsLib, file, nextPage);
            if (!result.entities.length) throw new Error("No vector paths found. Scanned drawings need a separate tracing step before a reliable DXF can be made.");
            setDrawing(result);
            setEntities(withFilters(result, nextOptions));
            setPageNumber(nextPage);
            setCalibration([]);
            setUndoStack([]);
            setMessage(`${result.entities.length} vector paths found on page ${nextPage}. Review the geometry, then calibrate a known distance.`);
        } catch (error) { setMessage(error.message || "Could not read this PDF drawing."); }
        finally { setBusy(false); }
    };

    const pointFromEvent = event => {
        const svg = svgRef.current;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const local = point.matrixTransform(svg.getScreenCTM().inverse());
        return [local.x, drawing.height - local.y];
    };

    const brushAt = point => setEntities(current => current.map(entity => entity.visible && touchedByBrush(entity, point, Number(brushRadius)) ? { ...entity, visible: false } : entity));
    const pointerDown = event => {
        if (!drawing) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const point = pointFromEvent(event);
        if (mode === "calibrate") {
            setCalibration(current => current.length === 2 ? [point] : [...current, point]);
            return;
        }
        setUndoStack(current => [...current.slice(-19), entities.map(entity => entity.visible)]);
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
            if (x1 - x0 > 2 && y1 - y0 > 2) setEntities(current => current.map(entity => {
                const [a, b, c, d] = entity.bounds;
                const inside = a >= x0 && c <= x1 && b >= y0 && d <= y1;
                return mode === "keep-box" ? { ...entity, visible: entity.visible && inside } : inside ? { ...entity, visible: false } : entity;
            }));
            setBox(null);
        }
    };

    const download = () => {
        try {
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

    return <div className="min-h-screen bg-slate-100 pb-24 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-600">Admin drawing tool</p><h2 className="mt-2 text-3xl font-extrabold text-slate-950">PDF to DXF</h2><p className="mt-2 max-w-3xl text-sm text-slate-600">Extract vector geometry from a drawing PDF, clean it in the preview, calibrate against a known dimension, and download the reviewed DXF.</p></div>
            <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
                <div className="space-y-5">
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">1. Upload and filter</h3>
                        <input aria-label="Upload PDF drawing" type="file" accept="application/pdf,.pdf" onChange={event => { setFile(event.target.files?.[0] || null); setDrawing(null); setEntities([]); }} className="mt-4 w-full text-sm" />
                        <p className="mt-4 text-xs font-bold text-slate-600">Remove before conversion</p>
                        {[
                            ["removeText", "Text and small outlined labels"], ["removeDimensions", "Dimensions and hole diameter callouts"],
                            ["removeCentreLines", "Centre lines and construction marks"], ["removeFrame", "Page border and title block"]
                        ].map(([key, label]) => <label key={key} className="mt-2 flex items-start gap-2 text-xs text-slate-700"><input type="checkbox" checked={options[key]} onChange={event => setOptions(current => ({ ...current, [key]: event.target.checked }))} className="mt-0.5" /><span>{label}</span></label>)}
                        <button type="button" disabled={!file || busy} onClick={() => convert(1)} className="mt-5 w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50">{busy ? "Reading drawing…" : "Convert and preview"}</button>
                        {drawing && <label className="mt-4 block text-xs font-bold">PDF page <select value={pageNumber} onChange={event => convert(Number(event.target.value))} className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-2">{Array.from({ length: drawing.pageCount }, (_, index) => <option key={index} value={index + 1}>Page {index + 1}</option>)}</select></label>}
                    </section>
                    {drawing && <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">2. Clean the preview</h3>
                        <div className="mt-3 grid grid-cols-2 gap-2">{[["brush", "Brush remove"], ["remove-box", "Remove box"], ["keep-box", "Keep box"], ["calibrate", "Calibrate"]].map(([value, label]) => <button key={value} type="button" onClick={() => setMode(value)} className={`rounded border px-2 py-2 text-xs font-bold ${mode === value ? "border-blue-700 bg-blue-50 text-blue-700" : "border-slate-300"}`}>{label}</button>)}</div>
                        {mode === "brush" && <label className="mt-3 block text-xs">Brush size <input type="range" min="2" max="30" value={brushRadius} onChange={event => setBrushRadius(event.target.value)} className="w-full" /></label>}
                        <div className="mt-3 flex gap-2"><button type="button" disabled={!undoStack.length} onClick={() => { const previous = undoStack.at(-1); setEntities(current => current.map((entity, index) => ({ ...entity, visible: previous[index] }))); setUndoStack(current => current.slice(0, -1)); }} className="rounded border border-slate-300 px-3 py-2 text-xs font-bold disabled:opacity-40">Undo</button><button type="button" onClick={() => { setEntities(withFilters(drawing, options)); setUndoStack([]); }} className="rounded border border-slate-300 px-3 py-2 text-xs font-bold">Reset filters</button></div>
                        <p className="mt-3 text-xs text-slate-500">{visibleCount} of {entities.length} paths kept. Brush and box tools remove whole vector paths, not pixels.</p>
                    </section>}
                    {drawing && <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">3. Set actual scale</h3><p className="mt-2 text-xs text-slate-600">Choose Calibrate, click the two ends of a known dimension in the preview, and enter its actual length in mm.</p><input type="number" min="0.001" step="any" value={knownMm} onChange={event => setKnownMm(event.target.value)} placeholder="Known distance in mm" aria-label="Known distance in millimetres" className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm" /><p className="mt-2 text-xs text-slate-500">{calibration.length}/2 points selected{scale ? ` · ${scale.toFixed(5)} mm per PDF point` : ""}</p><button type="button" disabled={!scale || !visibleCount} onClick={download} className="mt-4 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-extrabold text-white disabled:opacity-40">Download reviewed DXF</button></section>}
                </div>
                <section className="min-h-[480px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-extrabold">DXF geometry preview</h3>{drawing && <span className="text-xs text-slate-500">Page {pageNumber} of {drawing.pageCount}</span>}</div>
                    {drawing ? <div className="overflow-auto rounded border border-slate-200 bg-slate-50"><svg ref={svgRef} viewBox={`0 0 ${drawing.width} ${drawing.height}`} className="dxf-preview-svg w-full" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
                        <rect x="0" y="0" width={drawing.width} height={drawing.height} fill="white" />
                        {entities.filter(entity => entity.visible).map(entity => <path key={entity.id} d={pathFor(entity.points, drawing.height)} fill="none" stroke={entity.kind === "geometry" ? "#102a43" : entity.kind === "dimension" ? "#315ee8" : "#d65b3b"} strokeWidth="0.75" vectorEffect="non-scaling-stroke" />)}
                        {calibration.map((point, index) => <circle key={index} cx={point[0]} cy={drawing.height - point[1]} r="3" fill="#e11d48" />)}
                        {calibration.length === 2 && <line x1={calibration[0][0]} y1={drawing.height - calibration[0][1]} x2={calibration[1][0]} y2={drawing.height - calibration[1][1]} stroke="#e11d48" strokeWidth="1.5" />}
                        {box && <rect x={Math.min(box.start[0], box.end[0])} y={drawing.height - Math.max(box.start[1], box.end[1])} width={Math.abs(box.end[0] - box.start[0])} height={Math.abs(box.end[1] - box.start[1])} fill="#3b82f633" stroke="#2563eb" />}
                    </svg></div> : <div className="flex min-h-[420px] items-center justify-center rounded border border-dashed border-slate-300 text-sm text-slate-500">Upload a vector PDF to see its geometry here.</div>}
                    {message && <p role="status" className="mt-3 text-sm text-slate-700">{message}</p>}
                    <p className="mt-3 text-xs text-slate-500">Review dimensions, holes, open contours and scale in CAD before cutting. Scanned pages and outlined text cannot be converted with guaranteed accuracy automatically.</p>
                </section>
            </div>
        </div>
    </div>;
}

const number = value => Number(value || 0);

const gridFit = (rawLength, rawWidth, partLength, partWidth, gap) => {
    const columns = Math.max(0, Math.floor((rawLength + gap) / (partLength + gap)));
    const rows = Math.max(0, Math.floor((rawWidth + gap) / (partWidth + gap)));
    const placements = [];
    for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) placements.push({ x: column * (partLength + gap), y: row * (partWidth + gap), w: partLength, h: partWidth });
    }
    return { count: columns * rows, cols: columns, rows, fitL: partLength, fitW: partWidth, placements };
};

// Tests pure and rotated grids, then simple mixed-orientation strip layouts.
// This is intentionally deterministic and fast enough to recalculate while editing.
export const calculateBestSheetFit = (rawLengthValue, rawWidthValue, partLengthValue, partWidthValue, gapValue = 0) => {
    const rawLength = number(rawLengthValue);
    const rawWidth = number(rawWidthValue);
    const partLength = number(partLengthValue);
    const partWidth = number(partWidthValue);
    const gap = Math.max(0, number(gapValue));
    if ([rawLength, rawWidth, partLength, partWidth].some(value => value <= 0)) {
        return { count: 0, cols: 0, rows: 0, fitL: partLength, fitW: partWidth, orientation: "Not available", strategy: "none" };
    }

    const standard = { ...gridFit(rawLength, rawWidth, partLength, partWidth, gap), orientation: "Standard", strategy: "grid" };
    const rotated = { ...gridFit(rawLength, rawWidth, partWidth, partLength, gap), orientation: "Rotated", strategy: "grid" };
    const candidates = [standard, rotated];

    const standardRows = Math.floor((rawWidth + gap) / (partWidth + gap));
    const maxStandardColumns = Math.floor((rawLength + gap) / (partLength + gap));
    for (let standardColumns = 1; standardColumns <= maxStandardColumns; standardColumns += 1) {
        const remainingLength = rawLength - (standardColumns * partLength) - (standardColumns * gap);
        if (remainingLength < partWidth) continue;
        const rotatedColumns = Math.floor((remainingLength + gap) / (partWidth + gap));
        const rotatedRows = Math.floor((rawWidth + gap) / (partLength + gap));
        const placements = [];
        for (let column = 0; column < standardColumns; column += 1) for (let row = 0; row < standardRows; row += 1) placements.push({ x: column * (partLength + gap), y: row * (partWidth + gap), w: partLength, h: partWidth });
        const rotatedStart = standardColumns * (partLength + gap);
        for (let column = 0; column < rotatedColumns; column += 1) for (let row = 0; row < rotatedRows; row += 1) placements.push({ x: rotatedStart + column * (partWidth + gap), y: row * (partLength + gap), w: partWidth, h: partLength });
        candidates.push({
            count: (standardColumns * standardRows) + (rotatedColumns * rotatedRows),
            cols: standardColumns + rotatedColumns,
            rows: Math.max(standardRows, rotatedRows),
            fitL: partLength,
            fitW: partWidth,
            orientation: "Mixed rotation",
            strategy: "mixed-vertical",
            placements
        });
    }

    const standardColumns = Math.floor((rawLength + gap) / (partLength + gap));
    const maxStandardRows = Math.floor((rawWidth + gap) / (partWidth + gap));
    for (let standardRowCount = 1; standardRowCount <= maxStandardRows; standardRowCount += 1) {
        const remainingWidth = rawWidth - (standardRowCount * partWidth) - (standardRowCount * gap);
        if (remainingWidth < partLength) continue;
        const rotatedRows = Math.floor((remainingWidth + gap) / (partLength + gap));
        const rotatedColumns = Math.floor((rawLength + gap) / (partWidth + gap));
        const placements = [];
        for (let column = 0; column < standardColumns; column += 1) for (let row = 0; row < standardRowCount; row += 1) placements.push({ x: column * (partLength + gap), y: row * (partWidth + gap), w: partLength, h: partWidth });
        const rotatedStart = standardRowCount * (partWidth + gap);
        for (let column = 0; column < rotatedColumns; column += 1) for (let row = 0; row < rotatedRows; row += 1) placements.push({ x: column * (partWidth + gap), y: rotatedStart + row * (partLength + gap), w: partWidth, h: partLength });
        candidates.push({
            count: (standardColumns * standardRowCount) + (rotatedColumns * rotatedRows),
            cols: Math.max(standardColumns, rotatedColumns),
            rows: standardRowCount + rotatedRows,
            fitL: partLength,
            fitW: partWidth,
            orientation: "Mixed rotation",
            strategy: "mixed-horizontal",
            placements
        });
    }

    return candidates.reduce((best, candidate) => candidate.count > best.count ? candidate : best, standard);
};

const sumPatternCounts = (text, patterns, fallback = 0) => {
    const counts = new Map();
    patterns.forEach(pattern => {
        for (const match of text.matchAll(pattern)) {
            const value = number(match[1] || match[2] || 1);
            const key = `${match.index}:${value}`;
            if (!counts.has(key)) counts.set(key, value);
        }
    });
    return counts.size ? [...counts.values()].reduce((sum, value) => sum + Math.max(1, value), 0) : fallback;
};

export const inferOperationCounts = (sourceText, parsed = {}) => {
    const text = String(sourceText || "").toLowerCase();
    const explicitHoles = number(parsed.holeCount);
    const holes = explicitHoles || sumPatternCounts(text, [
        /(?:qty\s*)?(\d+)\s*[x×-]?\s*(?:nos?\.?\s*)?(?:holes?|drill(?:ed|ing)?)/g,
        /(\d+)\s*(?:nos?\.?|places?|plcs?)?\s*[x×]?\s*(?:ø|⌀|dia\.?|diameter)/g,
        /(\d+)\s*[x×]\s*(?:ø|⌀)\s*\d/g
    ], /\b(?:hole|drill|dia|diameter|ø|⌀)\b/.test(text) ? 1 : 0);
    const taps = sumPatternCounts(text, [
        /(\d+)\s*[x×-]?\s*(?:nos?\.?)?\s*(?:tapped|tapping|tap holes?)/g,
        /(\d+)\s*[x×]\s*m\s*\d+(?:\.\d+)?\s*(?:tap|thread)?/g
    ], /\b(?:tap|tapped|tapping|threaded)\b/.test(text) ? 1 : 0);
    const cutouts = sumPatternCounts(text, [/(\d+)\s*[x×-]?\s*(?:nos?\.?)?\s*(?:cutouts?|cut-outs?|windows?)/g], /\b(?:cutout|cut-out|window)\b/.test(text) ? 1 : 0);
    const slots = sumPatternCounts(text, [/(\d+)\s*[x×-]?\s*(?:nos?\.?)?\s*slots?/g], /\bslot\b/.test(text) ? 1 : 0);
    const cornerCuts = sumPatternCounts(text, [/(\d+)\s*[x×-]?\s*(?:corner cuts?|notches?)/g], /\b(?:corner cut|notch)\b/.test(text) ? 1 : 0);
    const roundCorners = number(parsed.cornerRadius)
        ? (sumPatternCounts(text, [/(\d+)\s*[x×-]?\s*(?:round(?:ed)? corners?|r\s*\d)/g], 4) || 4)
        : sumPatternCounts(text, [/(\d+)\s*[x×-]?\s*(?:round(?:ed)? corners?)/g], /round(?:ed)? corners?/.test(text) ? 4 : 0);
    const chamfers = sumPatternCounts(text, [/(\d+)\s*[x×-]?\s*(?:chamfers?|bevels?)/g], /\b(?:chamfer|bevel)\b/.test(text) ? 1 : 0);
    const countersinks = sumPatternCounts(text, [/(\d+)\s*[x×-]?\s*(?:countersinks?|counterbores?)/g], /\b(?:countersink|counterbore)\b/.test(text) ? 1 : 0);
    const otherOperations = ["deburr", "edge finish", "polish", "engrave", "marking", "recess", "special process"].filter(keyword => text.includes(keyword)).length;
    return { holes, taps, cutouts, slots, cornerCuts, roundCorners, chamfers, countersinks, otherOperations };
};

export const estimateProcessingCosts = ({ text, parsed, product }) => {
    const counts = inferOperationCounts(text, parsed);
    const thickness = Math.max(1, number(parsed.cutThickness || parsed.thickness || 5));
    const materialFactor = /glass epoxy|fr4|g10|frp/i.test(product) ? 1.25 : /nylon|delrin|acetal/i.test(product) ? 1.18 : 1;
    const thicknessFactor = Math.min(2.2, Math.max(1, thickness / 5));
    const perimeter = 2 * (number(parsed.cutLength) + number(parsed.cutWidth));
    const round = value => Math.round(value * 100) / 100;
    const details = {
        sheetCutting: parsed.cutLength && parsed.cutWidth ? round(Math.max(5, (perimeter / 300) * materialFactor * thicknessFactor)) : 0,
        cornerCutting: round(counts.cornerCuts * 1.75 * materialFactor),
        drilling: round(counts.holes * (1.25 + Math.min(2.5, number(parsed.holeDiameter) / 12)) * materialFactor * Math.sqrt(thicknessFactor)),
        tapping: round(counts.taps * 4.5 * materialFactor),
        chamfering: round(counts.chamfers * 2.5 * materialFactor),
        boxCutting: round((counts.cutouts * 9 + counts.slots * 5) * materialFactor * Math.sqrt(thicknessFactor)),
        uShapeCutting: /u[ -]?shape/i.test(String(text || "")) ? round(10 * materialFactor) : 0,
        roundCorners: round(counts.roundCorners * 1.25 * materialFactor),
        additionalCustomisation: round(((counts.countersinks * 3.25) + (counts.otherOperations * 4)) * materialFactor)
    };
    return { counts, details };
};

export const calculateDetectionConfidence = row => {
    if (row.detectedFields) {
        const essentials = ["drawingNo", "material", "length", "width", "thickness"];
        const detected = essentials.filter(field => row.detectedFields[field]).length;
        const operationBonus = row.operationCounts && Object.values(row.operationCounts).some(number) ? 8 : 0;
        const ocrPenalty = row.ocrUsed ? 4 : 0;
        return Math.max(20, Math.min(98, Math.round(30 + (detected / essentials.length) * 60 + operationBonus - ocrPenalty)));
    }
    const checks = [row.drawingNo, row.material, row.cutLength, row.cutWidth, row.cutThickness, row.rawLength, row.rawWidth, row.rawPrice];
    const detected = checks.filter(value => value !== "" && value !== null && value !== undefined && number(value) !== 0).length;
    const operationBonus = row.operationCounts && Object.values(row.operationCounts).some(number) ? 8 : 0;
    const ocrPenalty = row.ocrUsed ? 4 : 0;
    return Math.max(20, Math.min(98, Math.round(35 + (detected / checks.length) * 55 + operationBonus - ocrPenalty)));
};

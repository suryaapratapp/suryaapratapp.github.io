// Infer scale only when two stated millimetre dimensions agree with the
// proportions of a connected part outline. Never infer it from paper size.
export function dimensionPairs(text) {
    const pairs = [];
    const pattern = /\b(\d{1,5}(?:\.\d+)?)\s*[xX×]\s*(\d{1,5}(?:\.\d+)?)(?:\s*[xX×]\s*\d{1,5}(?:\.\d+)?)?/g;
    const explicitUnits = /(?:all\s+dimensions?\s+(?:are\s+)?in\s+mm|dimensions?\s+in\s+millimet)/i.test(text);
    for (const match of text.matchAll(pattern)) {
        const nearby = text.slice(match.index, match.index + match[0].length + 15);
        if (!explicitUnits && !/^\s*(?:mm|millimet)/i.test(nearby.slice(match[0].length))) continue;
        const width = Number(match[1]), height = Number(match[2]);
        if (width > 0 && height > 0 && width <= 100000 && height <= 100000) pairs.push({ width, height, label: match[0] });
    }
    return pairs;
}

export function findPartOutlines(entities, pageWidth, pageHeight) {
    const paths = entities.filter(entity => entity.kind === "geometry" && entity.points.length > 1);
    const parents = paths.map((_, index) => index);
    const root = index => { while (parents[index] !== index) { parents[index] = parents[parents[index]]; index = parents[index]; } return index; };
    const cells = new Map(), tolerance = 1;
    paths.forEach((entity, index) => {
        for (const point of [entity.points[0], entity.points[entity.points.length - 1]]) {
            const x = Math.floor(point[0] / tolerance), y = Math.floor(point[1] / tolerance);
            for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
                for (const entry of cells.get(`${x + dx},${y + dy}`) || []) {
                    if (Math.hypot(point[0] - entry.point[0], point[1] - entry.point[1]) <= tolerance) parents[root(index)] = root(entry.index);
                }
            }
            const key = `${x},${y}`;
            if (!cells.has(key)) cells.set(key, []);
            cells.get(key).push({ point, index });
        }
    });
    const groups = new Map();
    paths.forEach((entity, index) => {
        const key = root(index), bounds = groups.get(key) || [Infinity, Infinity, -Infinity, -Infinity];
        bounds[0] = Math.min(bounds[0], entity.bounds[0]); bounds[1] = Math.min(bounds[1], entity.bounds[1]);
        bounds[2] = Math.max(bounds[2], entity.bounds[2]); bounds[3] = Math.max(bounds[3], entity.bounds[3]);
        groups.set(key, bounds);
    });
    return [...groups.values()].filter(([x0, y0, x1, y1]) => {
        const width = x1 - x0, height = y1 - y0;
        return width > 20 && height > 20 && width < pageWidth * 0.88 && height < pageHeight * 0.88;
    }).sort((a, b) => (b[2] - b[0]) * (b[3] - b[1]) - (a[2] - a[0]) * (a[3] - a[1])).slice(0, 30);
}

export function inferDrawingScale(text, entities, width, height) {
    const pairs = dimensionPairs(text), outlines = findPartOutlines(entities, width, height);
    const matches = [];
    for (const pair of pairs) for (const bounds of outlines) {
        const w = bounds[2] - bounds[0], h = bounds[3] - bounds[1];
        for (const [actualW, actualH] of [[pair.width, pair.height], [pair.height, pair.width]]) {
            const sx = actualW / w, sy = actualH / h;
            const disagreement = Math.abs(sx - sy) / ((sx + sy) / 2);
            if (disagreement <= 0.015) matches.push({ scale: (sx + sy) / 2, bounds, actualW, actualH, label: pair.label, disagreement, area: w * h });
        }
    }
    if (!matches.length) return null;
    matches.sort((a, b) => b.area - a.area || a.disagreement - b.disagreement);
    const best = matches[0];
    // Comparable outlines suggesting different scales are ambiguous.
    if (matches.some(match => match.area > best.area * 0.75 && Math.abs(match.scale / best.scale - 1) > 0.03)) return null;
    return best;
}

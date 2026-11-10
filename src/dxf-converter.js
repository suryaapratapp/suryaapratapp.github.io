// PDF vector extraction for the admin drawing review tool. Coordinates stay in
// PDF points until a scale in millimetres has been reviewed.
const applyMatrix = (matrix, point) => [
    matrix[0] * point[0] + matrix[2] * point[1] + matrix[4],
    matrix[1] * point[0] + matrix[3] * point[1] + matrix[5]
];

const multiplyMatrix = (a, b) => [
    a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]
];

const bezierPoint = (a, b, c, d, t) => {
    const s = 1 - t;
    return [0, 1].map(i => s * s * s * a[i] + 3 * s * s * t * b[i] + 3 * s * t * t * c[i] + t * t * t * d[i]);
};

function decodePath(operators, values, matrix, OPS) {
    const paths = [];
    let path = [];
    let cursor = null;
    let start = null;
    let offset = 0;
    const flush = () => {
        if (path.length > 1) paths.push(path);
        path = [];
        cursor = null;
        start = null;
    };
    for (const operator of operators) {
        if (operator === OPS.moveTo) {
            flush();
            cursor = applyMatrix(matrix, [values[offset++], values[offset++]]);
            start = cursor;
            path.push(cursor);
        } else if (operator === OPS.lineTo) {
            cursor = applyMatrix(matrix, [values[offset++], values[offset++]]);
            path.push(cursor);
        } else if (operator === OPS.curveTo || operator === OPS.curveTo2 || operator === OPS.curveTo3) {
            if (!cursor) continue;
            let control1, control2, end;
            if (operator === OPS.curveTo) {
                control1 = applyMatrix(matrix, [values[offset++], values[offset++]]);
                control2 = applyMatrix(matrix, [values[offset++], values[offset++]]);
                end = applyMatrix(matrix, [values[offset++], values[offset++]]);
            } else if (operator === OPS.curveTo2) {
                control1 = cursor;
                control2 = applyMatrix(matrix, [values[offset++], values[offset++]]);
                end = applyMatrix(matrix, [values[offset++], values[offset++]]);
            } else {
                control1 = applyMatrix(matrix, [values[offset++], values[offset++]]);
                end = applyMatrix(matrix, [values[offset++], values[offset++]]);
                control2 = end;
            }
            const previous = cursor;
            for (let step = 1; step <= 16; step++) path.push(bezierPoint(previous, control1, control2, end, step / 16));
            cursor = end;
        } else if (operator === OPS.closePath) {
            if (start && cursor && Math.hypot(start[0] - cursor[0], start[1] - cursor[1]) > 0.001) path.push(start);
            flush();
        } else if (operator === OPS.rectangle) {
            flush();
            const x = values[offset++], y = values[offset++], w = values[offset++], h = values[offset++];
            path = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]].map(point => applyMatrix(matrix, point));
            flush();
        }
    }
    flush();
    return paths;
}

const colorType = color => {
    const [r, g, b] = color;
    if (b > r * 1.35 && b > g * 1.2 && b > 70) return "dimension";
    if (r > g * 1.4 && r > b * 1.4 && r > 70) return "centreline";
    if (Math.max(r, g, b) > 120) return "reference";
    return "geometry";
};

const bboxOf = points => {
    const xs = points.map(point => point[0]), ys = points.map(point => point[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

export async function extractPdfGeometry(pdfjs, file, pageNumber) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data: bytes }).promise;
    try {
        const count = pdf.numPages;
        if (pageNumber < 1 || pageNumber > count) throw new Error("Choose a page in this PDF.");
        const page = await pdf.getPage(pageNumber);
        const [left, bottom, right, top] = page.view;
        const list = await page.getOperatorList();
        const textContent = await page.getTextContent();
        const OPS = pdfjs.OPS;
        let matrix = [1, 0, 0, 1, 0, 0];
        let stroke = [0, 0, 0];
        let pending = [];
        const stack = [];
        const entities = [];
        for (let index = 0; index < list.fnArray.length; index++) {
            const op = list.fnArray[index], args = list.argsArray[index];
            if (op === OPS.save) stack.push({ matrix: [...matrix], stroke: [...stroke] });
            else if (op === OPS.restore) {
                const saved = stack.pop();
                if (saved) ({ matrix, stroke } = saved);
            } else if (op === OPS.transform) matrix = multiplyMatrix(matrix, args);
            else if (op === OPS.setStrokeRGBColor) stroke = Array.from(args).map(value => value <= 1 ? Math.round(value * 255) : value);
            else if (op === OPS.setStrokeGray) {
                const gray = args[0] <= 1 ? Math.round(args[0] * 255) : args[0];
                stroke = [gray, gray, gray];
            } else if (op === OPS.constructPath) pending.push(...decodePath(args[0], args[1], matrix, OPS));
            else if ([OPS.stroke, OPS.closeStroke, OPS.fillStroke, OPS.closeFillStroke, OPS.eoFillStroke].includes(op)) {
                for (const absolutePoints of pending) {
                    const points = absolutePoints.map(([x, y]) => [x - left, y - bottom]);
                    const bounds = bboxOf(points);
                    const kind = colorType(stroke);
                    const width = bounds[2] - bounds[0], height = bounds[3] - bounds[1];
                    entities.push({ id: entities.length, points, bounds, kind, color: [...stroke],
                        // Text in CAD PDFs is often outlined. This flag is deliberately
                        // reviewable because small holes can resemble outlined glyphs.
                        textCandidate: kind === "geometry" && width < 7 && height < 7 && points.length < 55 });
                }
                pending = [];
            } else if ([OPS.fill, OPS.eoFill, OPS.endPath, OPS.clip, OPS.eoClip].includes(op)) pending = [];
        }
        return { width: right - left, height: top - bottom, pageCount: count, entities, left, bottom,
            text: textContent.items.map(item => item.str || "").join(" ") };
    } finally {
        await pdf.destroy();
    }
}

const dxfNumber = number => Number(number.toFixed(6)).toString();
const pair = (code, value) => `${code}\n${value}\n`;
const safeLayer = name => name.replace(/[^A-Z0-9_-]/gi, "_").slice(0, 31);

function possibleCircle(points) {
    if (points.length < 12) return null;
    const [x0, y0, x1, y1] = bboxOf(points);
    const width = x1 - x0, height = y1 - y0;
    if (width <= 0 || Math.abs(width - height) / Math.max(width, height) > 0.08) return null;
    const centre = [(x0 + x1) / 2, (y0 + y1) / 2], radius = (width + height) / 4;
    if (Math.hypot(points[0][0] - points.at(-1)[0], points[0][1] - points.at(-1)[1]) > radius * 0.1) return null;
    if (points.some(point => Math.abs(Math.hypot(point[0] - centre[0], point[1] - centre[1]) - radius) > radius * 0.08)) return null;
    return { centre, radius };
}

export function makeDxf(entities, scaleMmPerPoint, origin) {
    if (!(scaleMmPerPoint > 0) || !Number.isFinite(scaleMmPerPoint)) throw new Error("Calibrate a known distance before exporting DXF.");
    const included = entities.filter(entity => entity.visible);
    if (!included.length) throw new Error("The reviewed drawing has no entities to export.");
    let output = pair(0, "SECTION") + pair(2, "HEADER") + pair(9, "$ACADVER") + pair(1, "AC1015") +
        pair(9, "$INSUNITS") + pair(70, 4) + pair(0, "ENDSEC") + pair(0, "SECTION") + pair(2, "ENTITIES");
    for (const entity of included) {
        const layer = safeLayer(entity.kind.toUpperCase());
        const circle = possibleCircle(entity.points);
        if (circle) {
            output += pair(0, "CIRCLE") + pair(100, "AcDbEntity") + pair(8, layer) + pair(100, "AcDbCircle") + pair(10, dxfNumber((circle.centre[0] - origin[0]) * scaleMmPerPoint)) +
                pair(20, dxfNumber((circle.centre[1] - origin[1]) * scaleMmPerPoint)) + pair(40, dxfNumber(circle.radius * scaleMmPerPoint));
        } else {
            const points = entity.points;
            const closed = points.length > 2 && Math.hypot(points[0][0] - points.at(-1)[0], points[0][1] - points.at(-1)[1]) < 0.001;
            const vertices = closed ? points.slice(0, -1) : points;
            output += pair(0, "LWPOLYLINE") + pair(100, "AcDbEntity") + pair(8, layer) + pair(100, "AcDbPolyline") + pair(90, vertices.length) + pair(70, closed ? 1 : 0);
            for (const point of vertices) output += pair(10, dxfNumber((point[0] - origin[0]) * scaleMmPerPoint)) + pair(20, dxfNumber((point[1] - origin[1]) * scaleMmPerPoint));
        }
    }
    return output + pair(0, "ENDSEC") + pair(0, "EOF");
}

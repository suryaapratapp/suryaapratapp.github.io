import test from "node:test";
import assert from "node:assert/strict";
import { dimensionPairs, inferDrawingScale } from "../src/dxf-scale.js";
import { makeDxf } from "../src/dxf-converter.js";

const outline = {
    id: 1, kind: "geometry", visible: true,
    bounds: [100, 100, 486, 405],
    points: [[100, 100], [486, 100], [486, 405], [100, 405], [100, 100]]
};

test("recognises stated millimetre dimensions and produces the corresponding DXF size", () => {
    const suggestion = inferDrawingScale("Plate 772 X 610 X 5 mm", [outline], 842, 595);
    assert.ok(suggestion);
    assert.ok(Math.abs(suggestion.scale - 2) < 0.00001);
    const output = makeDxf([outline], suggestion.scale, [100, 100]);
    assert.match(output, /\$INSUNITS\n70\n4\n/);
    assert.match(output, /10\n772\n20\n610\n/);
});

test("does not infer millimetres from an unlabelled size or inches", () => {
    assert.deepEqual(dimensionPairs("Plate 772 x 610 x 5"), []);
    assert.deepEqual(dimensionPairs("Plate 772 x 610 in"), []);
    assert.equal(inferDrawingScale("Plate 772 x 610 in", [outline], 842, 595), null);
});

test("rejects mismatched or conflicting dimension evidence", () => {
    assert.equal(inferDrawingScale("Plate 772 x 400 mm", [outline], 842, 595), null);
    assert.equal(inferDrawingScale("Plate 772 x 610 mm; alternate 1544 x 1220 mm", [outline], 842, 595), null);
});

test("reconstructs an outline from separate connected edges", () => {
    const paths = outline.points.slice(0, -1).map((start, index) => {
        const end = outline.points[index + 1];
        return { id: index, kind: "geometry", points: [start, end], bounds: [Math.min(start[0], end[0]), Math.min(start[1], end[1]), Math.max(start[0], end[0]), Math.max(start[1], end[1])] };
    });
    assert.equal(inferDrawingScale("Size 772 × 610 mm", paths, 842, 595)?.scale, 2);
});

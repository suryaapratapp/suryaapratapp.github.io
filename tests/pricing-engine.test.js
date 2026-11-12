import test from "node:test";
import assert from "node:assert/strict";
import { calculateBestSheetFit, inferOperationCounts, estimateProcessingCosts } from "../src/pricing-engine.js";

test("selects the best rectangular orientation", () => {
    const result = calculateBestSheetFit(2440, 1220, 300, 200, 2);
    assert.equal(result.count, 48);
    assert.equal(result.placements.length, result.count);
    assert.ok(["Standard", "Rotated", "Mixed rotation"].includes(result.orientation));
});

test("mixed nesting returns a drawable placement for every piece", () => {
    const result = calculateBestSheetFit(1000, 700, 150, 100, 2);
    assert.equal(result.orientation, "Mixed rotation");
    assert.equal(result.placements.length, result.count);
    assert.ok(result.placements.every(piece => piece.x + piece.w <= 1000 && piece.y + piece.h <= 700));
});

test("extracts manufacturing operation counts from drawing notes", () => {
    const counts = inferOperationCounts("6 x Ø10 holes, 2 tapped holes, 1 slot, 4 rounded corners R8", { cornerRadius: 8 });
    assert.ok(counts.holes >= 6);
    assert.ok(counts.taps >= 2);
    assert.equal(counts.slots, 1);
    assert.ok(counts.roundCorners >= 4);
});

test("processing estimate increases for a feature-rich drawing", () => {
    const simple = estimateProcessingCosts({ text: "", parsed: { cutLength: 300, cutWidth: 200, cutThickness: 5 }, product: "Bakelite / Phenolic Sheet" });
    const complex = estimateProcessingCosts({ text: "8 holes 2 tapping 1 cutout 4 rounded corners", parsed: { cutLength: 300, cutWidth: 200, cutThickness: 5, holeCount: 8, cornerRadius: 8 }, product: "Bakelite / Phenolic Sheet" });
    const total = value => Object.values(value.details).reduce((sum, item) => sum + item, 0);
    assert.ok(total(complex) > total(simple));
});

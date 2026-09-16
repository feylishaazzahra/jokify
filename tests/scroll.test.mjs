import test from "node:test";
import assert from "node:assert/strict";
import { scrollProgress } from "../scripts/scroll-math.mjs";

test("Scroll progress starts before a section, scrubs through it, and stops at its end", () => {
  assert.equal(scrollProgress(120, 800), 0);
  assert.equal(scrollProgress(0, 800), 0);
  assert.equal(scrollProgress(-400, 800), 0.5);
  assert.equal(scrollProgress(-800, 800), 1);
  assert.equal(scrollProgress(-1400, 800), 1);
});
test("A collapsed or non-overflowing scroll section never generates invalid transforms", () => {
  assert.equal(scrollProgress(-100, 0), 0);
  assert.equal(scrollProgress(0, -100), 0);
});

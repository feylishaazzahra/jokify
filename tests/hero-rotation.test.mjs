import test from "node:test";
import assert from "node:assert/strict";
import {
  HERO_ROTATION_MS,
  heroWorks,
  nextHeroWorkIndex,
} from "../scripts/hero-rotation.mjs";

test("hero preview rotates through one work every ten seconds", () => {
  assert.equal(HERO_ROTATION_MS, 10_000);
  assert.equal(heroWorks.length, 3);
  assert.equal(nextHeroWorkIndex(0, heroWorks.length), 1);
  assert.equal(nextHeroWorkIndex(2, heroWorks.length), 0);
});

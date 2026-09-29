import test from "node:test";
import assert from "node:assert/strict";
import {
  HERO_ROTATION_MS,
  heroWorks,
  nextHeroWorkIndex,
} from "../scripts/hero-rotation.mjs";

test("hero preview rotates through one work every ten seconds", () => {
  assert.equal(HERO_ROTATION_MS, 10_000);
  assert.deepEqual(
    heroWorks.map(({ title }) => title),
    [
      "Training Legislatif Booklet & Print Mockup",
      "Evercurse Event Merchandise & ID Kit",
      "Banner Sidang Tema Powerpuff",
      "Twibbon MPLS Tema Fantasi",
      "ID Card Pengabdian Masyarakat Biru",
      "Feeds Instagram Informasi",
      "Feeds Instagram Recap Kegiatan Tema Detektif",
    ],
  );
  assert.equal(nextHeroWorkIndex(0, heroWorks.length), 1);
  assert.equal(nextHeroWorkIndex(6, heroWorks.length), 0);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("mobile hero hides the scroll prompt", () => {
  const css = read("../styles/hero.css");

  assert.match(
    css,
    /@media \(max-width: 700px\)[\s\S]*?\.hero-explore\s*\{[\s\S]*?display:\s*none;/,
  );
});

test("mobile catalog filters stay on one horizontally scrollable line", () => {
  const css = read("../styles/template.css");

  assert.match(
    css,
    /\.filters\s*\{\s*flex-wrap:\s*nowrap;\s*overflow-x:\s*auto;/,
  );
  assert.match(css, /\.filter-btn\s*\{[\s\S]*?flex-shrink:\s*0;/);
});

test("catalog heading no longer renders a collection count", () => {
  const markup = read("../index.html");
  const app = read("../scripts/app.mjs");

  assert.doesNotMatch(markup, /catalogCount/);
  assert.doesNotMatch(app, /catalogCount/);
});

test("selected works uses a dark contrasting surface", () => {
  const css = read("../styles/hero.css");

  assert.match(css, /\.hero-work\s*\{[\s\S]*?background:\s*#183b52;/);
});

test("selected works label uses the requested hover and focus color", () => {
  const css = read("../styles/hero.css");

  assert.match(
    css,
    /\.hero-work:hover \.hero-work-caption,[\s\S]*?\.hero-work:focus-visible \.hero-work-caption\s*\{[\s\S]*?background:\s*#1c2027;/,
  );
});

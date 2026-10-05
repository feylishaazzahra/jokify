import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  categoryFromUrl,
  adminModeFromUrl,
  canonicalCategory,
  filterProjects,
  safeMediaUrl,
  driveId,
  imageUrl,
  normalizeProjects,
  isPdf,
} from "../scripts/catalog-core.mjs";
const require = createRequire(import.meta.url);
const { parseCatalog, readCatalog } = require("../lib/catalog.cjs");
const handler = require("../api/catalog.js");
const row = (values) => ({ c: values.map((v) => ({ v })) });
const envelope = (data) =>
  `/*O_o*/\ngoogle.visualization.Query.setResponse(${JSON.stringify(data)});`;
const headers = [
  "id",
  "title",
  "category",
  "categoryLabel",
  "images",
  "tools",
  "estTime",
  "desc",
];

test("Google catalog handles unlabeled columns, duplicate headers, and null cells", () => {
  const text = envelope({
    status: "ok",
    table: {
      cols: headers.map(() => ({ label: "" })),
      rows: [
        row(headers),
        row([
          "p1",
          'A "quoted" work',
          "feeds-carousel",
          "Social media",
          "assets/a.png, assets/b.png",
          "Canva, Figma",
          null,
          null,
        ]),
        row(headers),
      ],
    },
  });
  const projects = parseCatalog(text);
  assert.equal(projects.length, 1);
  assert.deepEqual(projects[0].images, ["assets/a.png", "assets/b.png"]);
  assert.deepEqual(projects[0].tools, ["Canva", "Figma"]);
  assert.equal(projects[0].title, 'A "quoted" work');
  assert.equal(projects[0].desc, "");
});
test("Parser respects labeled columns even if rearranged", () => {
  const text = envelope({
    status: "ok",
    table: {
      cols: ["title", "images", "id"].map((label) => ({ label })),
      rows: [row(["Work", "assets/a.png", "p1"])],
    },
  });
  assert.equal(parseCatalog(text)[0].id, "p1");
});
test("Catalog preserves an optional preview mode for mixed image ratios", () => {
  const text = envelope({
    status: "ok",
    table: {
      cols: ["title", "images", "previewMode", "id"].map((label) => ({ label })),
      rows: [row(["Poster", "assets/poster.png", "portrait", "p1"])],
    },
  });
  const [project] = parseCatalog(text);
  assert.equal(project.previewMode, "portrait");
  assert.equal(
    normalizeProjects([{ ...project, previewMode: "cover" }])[0].previewMode,
    "cover",
  );
  assert.equal(
    normalizeProjects([{ ...project, previewMode: "zoom" }])[0].previewMode,
    "contain",
  );
});
test("Parser rejects login HTML and Google error envelopes", () => {
  assert.throws(() => parseCatalog("<html>Sign in</html>"));
  assert.throws(() => parseCatalog(envelope({ status: "error" })));
});
test("Upstream network errors propagate for a retryable API failure", async () => {
  await assert.rejects(readCatalog(async () => ({ ok: false, status: 403 })));
  await assert.rejects(
    readCatalog(async () => {
      throw new Error("Network");
    }),
  );
});
test("Existing category links and aliases resolve correctly", () => {
  assert.equal(
    categoryFromUrl(new URL("https://jokify.tech/?cat=ppt")),
    "ppt-design",
  );
  assert.equal(
    categoryFromUrl(new URL("https://jokify.tech/?kategori=feeds-carousel")),
    "social-media",
  );
  assert.equal(
    categoryFromUrl(new URL("https://jokify.tech/#twibbon")),
    "twibbon",
  );
  assert.equal(categoryFromUrl(new URL("https://jokify.tech/#about")), "all");
  assert.equal(canonicalCategory("<img src=x>"), "all");
});
test("Admin mode supports the legacy parameter alias", () => {
  assert.equal(adminModeFromUrl(new URL("https://jokify.tech/?admin")), true);
  assert.equal(
    adminModeFromUrl(new URL("https://jokify.tech/?admin=true")),
    true,
  );
  assert.equal(adminModeFromUrl(new URL("https://jokify.tech/#admin")), true);
  assert.equal(adminModeFromUrl(new URL("https://jokify.tech/")), false);
});
test("Search combines category with multiple words and legacy social categories", () => {
  const projects = [
    {
      title: "FOMO campaign",
      desc: "Instagram",
      category: "feeds-carousel",
      categoryLabel: "Social media",
      tools: ["Canva"],
    },
    {
      title: "Menu",
      desc: "",
      category: "menu-design",
      categoryLabel: "Menu",
      tools: ["Figma"],
    },
  ];
  assert.equal(
    filterProjects(projects, "social-media", "fomo canva").length,
    1,
  );
  assert.equal(filterProjects(projects, "social-media", "figma").length, 0);
  assert.equal(filterProjects(projects, "all", "").length, 2);
});
test("Media rejects executable URLs and traversal, retaining valid asset paths", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hi",
    "//evil.test/a",
    "assets/../../.env",
    "https://user:pass@example.com/a",
  ])
    assert.equal(safeMediaUrl(url), "");
  assert.equal(
    safeMediaUrl("assets/uiux/hearlens-sign up-keyboard.png"),
    "assets/uiux/hearlens-sign up-keyboard.png",
  );
  assert.equal(
    imageUrl("https://drive.google.com/file/d/abc_123/view"),
    "https://lh3.googleusercontent.com/d/abc_123",
  );
  assert.equal(driveId("https://evil.test/d/abc_123"), null);
  assert.ok(isPdf("https://drive.google.com/file/d/abc/preview?pdf=true"));
});
test("Bad media entries are removed without breaking valid projects", () => {
  const projects = normalizeProjects([
    {
      id: 1,
      title: "<script>test</script>",
      images: ["javascript:alert(1)", "assets/a.png"],
      tools: [12],
    },
    null,
  ]);
  assert.equal(projects.length, 1);
  assert.deepEqual(projects[0].images, ["assets/a.png"]);
  assert.deepEqual(projects[0].tools, ["12"]);
});
test("Public catalog endpoint is read-only", async () => {
  const headers = {};
  let body;
  const response = {
    setHeader: (name, value) => {
      headers[name] = value;
    },
    end: (value) => {
      body = JSON.parse(value);
    },
  };
  await handler({ method: "POST" }, response);
  assert.equal(response.statusCode, 405);
  assert.equal(headers.Allow, "GET");
  assert.equal(body.error, "Method not allowed");
});

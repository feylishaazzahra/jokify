// Mechanical web derivatives; keep every original portfolio asset intact.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require(process.env.SHARP_MODULE || "sharp");
const root = path.resolve(__dirname, "..");
async function run() {
  const out = path.join(root, "assets/web");
  await fs.mkdir(out, { recursive: true });
  const manifest = {};
  const entries = await fs.readdir(path.join(root, "assets"), {
    recursive: true,
    withFileTypes: true,
  });
  let originalBytes = 0,
    optimizedBytes = 0;
  for (const entry of entries) {
    if (!entry.isFile() || !/\.(png|jpe?g)$/i.test(entry.name)) continue;
    const input = path.join(entry.parentPath || entry.path, entry.name);
    const relative = path.relative(root, input).split(path.sep).join("/");
    if (relative.startsWith("assets/web/")) continue;
    const isBrandLogo = relative === "assets/brand/logo-nobg.png";
    const name = isBrandLogo
      ? "logo-wordmark.webp"
      : path.basename(entry.name, path.extname(entry.name)) + ".webp";
    const output = path.join(out, name);
    const pipeline = isBrandLogo
      ? sharp(input).trim()
      : sharp(input).rotate().resize({
          width: 1200,
          height: 1400,
          fit: "inside",
          withoutEnlargement: true,
        });
    await pipeline
      .webp(isBrandLogo ? { lossless: true } : { quality: 82 })
      .toFile(output);
    manifest[relative] = `assets/web/${name}`;
    originalBytes += (await fs.stat(input)).size;
    optimizedBytes += (await fs.stat(output)).size;
  }
  if (process.argv[2]) {
    await sharp(process.argv[2])
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(path.join(out, "hero-chrome.webp"));
  }
  await fs.writeFile(
    path.join(out, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      images: Object.keys(manifest).length,
      originalMB: (originalBytes / 1048576).toFixed(2),
      optimizedMB: (optimizedBytes / 1048576).toFixed(2),
    }),
  );
}
run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

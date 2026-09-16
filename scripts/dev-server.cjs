const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const handler = require("../api/catalog.js");
const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".mjs": "text/javascript",
  ".js": "text/javascript",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (pathname === "/api/catalog") return handler(req, res);
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405).end();
    return;
  }
  const relative = pathname === "/" ? "index.html" : pathname.slice(1);
  const file = path.resolve(root, relative);
  const allowed =
    relative === "index.html" || /^(assets|styles|scripts)\//.test(relative);
  if (
    !allowed ||
    !file.startsWith(root + path.sep) ||
    !types[path.extname(file)]
  ) {
    res.writeHead(404).end();
    return;
  }
  try {
    const stat = await fs.promises.stat(file);
    if (!stat.isFile()) throw new Error("Not a file");
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)],
      "Content-Length": stat.size,
      "Cache-Control": "no-store",
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
server.listen(4173, "127.0.0.1", () =>
  console.log("Jokify preview: http://127.0.0.1:4173"),
);

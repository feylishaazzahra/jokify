const { readCatalog } = require("../lib/catalog.cjs");

module.exports = async function handler(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.statusCode = 405;
    return response.end(JSON.stringify({ error: "Method not allowed" }));
  }
  try {
    const projects = await readCatalog();
    // Always refresh after admin changes; no persistent catalog snapshot.
    response.setHeader("Cache-Control", "no-store");
    response.statusCode = 200;
    return response.end(JSON.stringify({ projects }));
  } catch {
    response.setHeader("Cache-Control", "no-store");
    response.statusCode = 502;
    return response.end(
      JSON.stringify({
        error: "Katalog belum bisa dimuat. Silakan coba lagi.",
      }),
    );
  }
};

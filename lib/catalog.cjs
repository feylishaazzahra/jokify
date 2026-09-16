const SPREADSHEET_ID = "1SqMH_thDYrrNWXTu-8URyK9CcGez0rMDRwY161Sffrw";
const CATALOG_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

// Google returns a JSONP envelope, not JSON. Parse data without executing it.
function parseCatalog(text) {
  const match = text.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/,
  );
  if (!match) throw new Error("Unexpected catalog format");
  const result = JSON.parse(match[1]);
  if (result.status !== "ok" || !Array.isArray(result.table?.rows))
    throw new Error("Catalog unavailable");
  const columns = result.table.cols.map((column) =>
    (column.label || "").toLowerCase().trim(),
  );
  return result.table.rows
    .map((row, index) => {
      const value = (name, fallback) =>
        String(
          row.c?.[columns.indexOf(name) < 0 ? fallback : columns.indexOf(name)]
            ?.v ?? "",
        ).trim();
      return {
        id: value("id", 0) || `row-${index}`,
        title: value("title", 1),
        category: value("category", 2),
        categoryLabel: value("categorylabel", 3),
        images: value("images", 4)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        tools: value("tools", 5)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        estTime: value("esttime", 6) || "Diskusikan brief",
        desc: value("desc", 7),
      };
    })
    .filter(
      (item) =>
        item.title &&
        item.title.toLowerCase() !== "title" &&
        item.images.length,
    );
}

async function readCatalog(fetcher = fetch) {
  const response = await fetcher(CATALOG_URL, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Catalog upstream: ${response.status}`);
  return parseCatalog(await response.text());
}

module.exports = { CATALOG_URL, parseCatalog, readCatalog };

export const categories = [
  ["all", "Semua karya"],
  ["banner-design", "Banner"],
  ["social-media", "Social media"],
  ["background-zoom", "Background Zoom"],
  ["twibbon", "Twibbon"],
  ["ppt-design", "Presentasi"],
  ["poster-infografis", "Poster & infografis"],
  ["idcard-lanyard", "Lanyard & ID card"],
  ["booklet", "Booklet"],
  ["logo-packaging", "Logo & packaging"],
  ["menu-design", "Menu"],
  ["it-system", "IT & system"],
  ["video-editing", "Video editing"],
  ["olah-data", "Olah data"],
];
const aliases = {
  banner: "banner-design",
  spanduk: "banner-design",
  social: "social-media",
  socialmedia: "social-media",
  feeds: "social-media",
  carousel: "social-media",
  "feeds-carousel": "social-media",
  zoom: "background-zoom",
  background: "background-zoom",
  backgroundzoom: "background-zoom",
  bingkai: "twibbon",
  frame: "twibbon",
  lanyard: "idcard-lanyard",
  idcard: "idcard-lanyard",
  ppt: "ppt-design",
  presentasi: "ppt-design",
  poster: "poster-infografis",
  infografis: "poster-infografis",
  modul: "booklet",
  logo: "logo-packaging",
  packaging: "logo-packaging",
  menu: "menu-design",
  it: "it-system",
  system: "it-system",
  video: "video-editing",
  editing: "video-editing",
  spss: "olah-data",
  data: "olah-data",
};
export function canonicalCategory(value = "") {
  const key = String(value).toLowerCase();
  const category = aliases[key] || key;
  return categories.some(([id]) => id === category) ? category : "all";
}
export function categoryFromUrl(url) {
  return canonicalCategory(
    url.searchParams.get("cat") ||
      url.searchParams.get("kategori") ||
      url.searchParams.get("category") ||
      url.hash.slice(1),
  );
}
export function adminModeFromUrl(url) {
  return url.searchParams.has("admin") || url.hash === "#admin";
}
export function filterProjects(projects, category, query) {
  const words = query
    .toLocaleLowerCase("id")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return projects.filter(
    (project) =>
      (category === "all" ||
        canonicalCategory(project.category) === category) &&
      words.every((word) =>
        `${project.title} ${project.desc} ${project.categoryLabel} ${project.tools.join(" ")}`
          .toLocaleLowerCase("id")
          .includes(word),
      ),
  );
}
export function safeMediaUrl(input) {
  if (typeof input !== "string") return "";
  const value = input.trim();
  if (/^assets\/[a-zA-Z0-9_ .\-/]+$/.test(value) && !value.includes(".."))
    return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}
export function driveId(input) {
  try {
    const url = new URL(input);
    if (
      !["drive.google.com", "lh3.googleusercontent.com"].includes(url.hostname)
    )
      return null;
    const id =
      url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
      url.searchParams.get("id");
    return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
export function isPdf(url) {
  return /\.pdf(?:[?#]|$)|[?&]pdf=true/i.test(url);
}
export function imageUrl(url) {
  const safe = safeMediaUrl(url);
  const id = driveId(safe);
  return id && !isPdf(safe)
    ? `https://lh3.googleusercontent.com/d/${id}`
    : safe;
}
export function previewMode(value = "") {
  const mode = String(value).toLowerCase().trim();
  return ["contain", "cover", "portrait"].includes(mode)
    ? mode
    : "contain";
}
export function normalizeProjects(raw) {
  if (!Array.isArray(raw)) throw new Error("Invalid catalog");
  return raw
    .filter(
      (item) =>
        item && typeof item.title === "string" && Array.isArray(item.images),
    )
    .map((item) => ({
      id: String(item.id),
      title: item.title,
      category: String(item.category || ""),
      categoryLabel: String(item.categoryLabel || ""),
      images: item.images.map(safeMediaUrl).filter(Boolean),
      tools: Array.isArray(item.tools) ? item.tools.map(String) : [],
      desc: String(item.desc || ""),
      estTime: String(item.estTime || "Diskusikan brief"),
      previewMode: previewMode(item.previewMode),
    }))
    .filter((item) => item.images.length);
}

import {
  categories,
  canonicalCategory,
  categoryFromUrl,
  filterProjects,
  normalizeProjects,
  imageUrl,
  driveId,
  isPdf,
} from "./catalog-core.mjs";

const PHONE = "6287888922537";
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyyaBW-bMhxjnmAlPuKfLUfiSgjyY7yet9D5NUedW-JSDjGlCmxZbrNRhZzGbP5cw3C/exec";
const $ = (id) => document.getElementById(id);
const state = {
  projects: [],
  category: categoryFromUrl(new URL(location.href)),
  limit: 9,
  loading: true,
  error: false,
  admin: false,
  images: {},
};
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const waUrl = (text) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
const element = (tag, className = "", text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const button = (text, className, action) => {
  const node = element("button", className, text);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
};
const externalLink = (text, url, className = "") => {
  const node = element("a", className, text);
  node.href = url;
  node.target = "_blank";
  node.rel = "noopener noreferrer";
  return node;
};
const scrollToNode = (node) =>
  node?.scrollIntoView({
    behavior:
      reducedMotion.matches || document.body.classList.contains("motion-off")
        ? "instant"
        : "smooth",
    block: "start",
  });
const displayName = () =>
  categories.find(([key]) => key === state.category)?.[1] || "Semua karya";

function mediaFallback(label, pdf = false) {
  const fallback = element("div", "media-fallback");
  fallback.append(
    element("span", "", pdf ? "PDF" : "JOKIFY"),
    element("span", "", label),
  );
  return fallback;
}

function createImage(url, title, eager = false) {
  const image = element("img");
  const source = state.images[url] || imageUrl(url);
  image.src = source;
  image.alt = title;
  image.loading = eager ? "eager" : "lazy";
  image.decoding = "async";
  // Keep layout useful if a Drive asset is private, deleted, or unreachable.
  image.addEventListener(
    "error",
    () => image.replaceWith(mediaFallback("Pratinjau belum tersedia")),
    { once: true },
  );
  return image;
}

function createCard(project) {
  const card = element("article", "project-card");
  const cover = button("", "project-cover", () => openProject(project));
  cover.classList.add(`project-cover--${project.previewMode}`);
  cover.setAttribute("aria-label", `Lihat detail ${project.title}`);
  const coverUrl =
    project.images.find((url) => !isPdf(url)) || project.images[0];
  cover.append(
    isPdf(coverUrl)
      ? mediaFallback("Lihat dokumen", true)
      : createImage(coverUrl, project.title),
  );
  cover.append(
    element(
      "span",
      "image-count",
      `${project.images.length} ${project.images.some(isPdf) ? "file" : "gambar"}`,
    ),
  );
  const meta = element("div", "project-meta");
  meta.append(
    element("span", "", project.categoryLabel),
    element("span", "", project.estTime),
  );
  const heading = element("h3");
  heading.append(
    button(project.title, "project-title", () => openProject(project)),
  );
  const actions = element("div", "card-actions");
  actions.append(
    externalLink(
      "Buat yang seperti ini ↗",
      waUrl(
        `Halo Jokify! Aku tertarik pesan jasa seperti contoh "${project.title}".`,
      ),
    ),
  );
  if (state.admin)
    actions.append(button("Hapus", "", () => deleteProject(project)));
  card.append(cover, meta, heading, actions);
  return card;
}

function renderCatalog() {
  $("portfolioGrid").setAttribute("aria-busy", String(state.loading));
  $("portfolioGrid").replaceChildren();
  $("loadMoreBtn").hidden = true;
  if (state.loading) {
    $("catalogStatus").textContent = "Memuat koleksi karya...";
    for (let index = 0; index < 9; index++) {
      const skeleton = element("div", "catalog-skeleton");
      skeleton.setAttribute("aria-hidden", "true");
      skeleton.append(
        element("div", "skeleton-cover"),
        element("div", "skeleton-line"),
        element("div", "skeleton-line"),
      );
      $("portfolioGrid").append(skeleton);
    }
    return;
  }
  if (state.error) {
    $("catalogStatus").replaceChildren(
      element(
        "span",
        "",
        "Koleksi belum bisa dimuat. Coba lagi atau konsultasikan brief lewat WhatsApp.",
      ),
      button("Coba lagi", "button button-dark", loadCatalog),
    );
    return;
  }
  const filtered = filterProjects(
    state.projects,
    state.category,
    $("searchInput").value,
  );
  const visible = filtered.slice(0, state.limit);
  $("catalogStatus").textContent =
    `${visible.length} dari ${filtered.length} karya${state.category === "all" ? "" : ` · ${displayName()}`}`;
  if (!filtered.length) {
    const empty = element("div", "empty-state");
    empty.append(
      element(
        "p",
        "",
        "Belum ada karya yang cocok. Coba kata kunci atau kategori lain.",
      ),
      button("Reset pencarian", "button button-outline", () => {
        $("searchInput").value = "";
        setCategory("all", { scroll: false });
      }),
    );
    $("portfolioGrid").append(empty);
  } else {
    $("portfolioGrid").append(...visible.map(createCard));
    $("loadMoreBtn").hidden = filtered.length <= state.limit;
  }
}

function updatePageMode() {
  const filtered = state.category !== "all";
  document.body.classList.toggle("catalog-mode", filtered);
  $("backHome").hidden = !filtered;
  $("heroTitle").setAttribute("aria-hidden", String(filtered));
  if (filtered) {
    $("worksTitle").textContent = displayName().toUpperCase();
    $("worksTitle").setAttribute("role", "heading");
    $("worksTitle").setAttribute("aria-level", "1");
    document.title = `${displayName()} — Jokify Portfolio`;
  } else {
    $("worksTitle").textContent = "THE FULL COLLECTION";
    $("worksTitle").removeAttribute("role");
    $("worksTitle").removeAttribute("aria-level");
    document.title = "Jokify — Ideas into Impact.";
  }
  document
    .querySelectorAll(".filter-btn")
    .forEach((node) =>
      node.setAttribute(
        "aria-pressed",
        String(node.dataset.category === state.category),
      ),
    );
  document.dispatchEvent(new Event("jokify:page-mode"));
}

function setCategory(category, { history = true, scroll = true } = {}) {
  state.category = canonicalCategory(category);
  state.limit = 9;
  if (history) {
    const url = new URL(location.href);
    ["cat", "kategori", "category"].forEach((key) =>
      url.searchParams.delete(key),
    );
    if (state.category !== "all") url.searchParams.set("cat", state.category);
    url.hash = "";
    window.history.pushState({}, "", url);
  }
  updatePageMode();
  renderCatalog();
  if (scroll)
    scrollToNode(
      state.category === "all" ? $("catalogControls") : $("katalog"),
    );
}

async function loadCatalog() {
  if (loadCatalog.pending) return;
  loadCatalog.pending = true;
  state.loading = true;
  state.error = false;
  renderCatalog();
  try {
    const response = await fetch("/api/catalog", {
      cache: "no-store",
      signal: AbortSignal.timeout(22000),
    });
    if (!response.ok) throw new Error("Catalog unavailable");
    const result = await response.json();
    state.projects = normalizeProjects(result.projects);
  } catch {
    state.error = true;
  } finally {
    state.loading = false;
    loadCatalog.pending = false;
    renderCatalog();
  }
}

function showDialog(id) {
  document.body.classList.add("dialog-open");
  $(id).showModal();
}
function showProjectMedia(project, index) {
  const url = project.images[index];
  $("modalViewer").replaceChildren();
  if (isPdf(url)) {
    const id = driveId(url);
    if (id) {
      const frame = element("iframe");
      frame.src = `https://drive.google.com/file/d/${id}/preview`;
      frame.title = `Dokumen ${project.title}`;
      frame.setAttribute("referrerpolicy", "no-referrer");
      $("modalViewer").append(frame);
    } else {
      const fallback = mediaFallback("Dokumen siap dibaca", true);
      fallback.append(externalLink("Buka PDF ↗", url, "button button-dark"));
      $("modalViewer").append(fallback);
    }
  } else $("modalViewer").append(createImage(url, project.title, true));
  [...$("modalThumbnails").children].forEach((node, i) =>
    node.setAttribute("aria-pressed", String(i === index)),
  );
}
function openProject(project) {
  $("modalTitle").textContent = project.title;
  $("modalCategory").textContent = project.categoryLabel;
  $("modalDesc").textContent =
    project.desc ||
    "Tertarik dengan gaya karya ini? Ceritakan kebutuhanmu, kita bantu sesuaikan dengan brief.";
  $("modalEstTime").textContent = project.estTime;
  $("modalTools").replaceChildren(
    ...project.tools.map((tool) => element("span", "", tool)),
  );
  $("modalWaBtn").href = waUrl(
    `Halo Jokify! Aku tertarik pesan jasa seperti contoh "${project.title}".`,
  );
  $("modalThumbnails").replaceChildren(
    ...project.images.map((url, index) => {
      const thumbnail = button("", "thumb-btn", () =>
        showProjectMedia(project, index),
      );
      thumbnail.setAttribute(
        "aria-label",
        `${isPdf(url) ? "Dokumen" : "Gambar"} ${index + 1}`,
      );
      thumbnail.append(
        isPdf(url)
          ? document.createTextNode("PDF")
          : createImage(url, "", true),
      );
      return thumbnail;
    }),
  );
  showProjectMedia(project, 0);
  showDialog("detailModal");
}

function toggleMenu(open) {
  $("mobileMenu").hidden = !open;
  $("menuToggle").setAttribute("aria-expanded", String(open));
  $("menuToggle").setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  document.body.classList.toggle("menu-open", open);
  $("main").inert = open;
  document.querySelector(".footer").inert = open;
  if (!open) $("menuToggle").focus({ preventScroll: true });
}
$("menuToggle").addEventListener("click", () =>
  toggleMenu($("mobileMenu").hidden),
);
document.addEventListener("keydown", (event) => {
  if (!$("mobileMenu").hidden) {
    if (event.key === "Escape") toggleMenu(false);
    if (event.key === "Tab") {
      const focusable = [
        $("menuToggle"),
        ...$("mobileMenu").querySelectorAll("a"),
      ];
      const index = focusable.indexOf(document.activeElement);
      event.preventDefault();
      focusable[
        (index + (event.shiftKey ? -1 : 1) + focusable.length) %
          focusable.length
      ].focus();
    }
  }
});

document.querySelectorAll("a[data-wa]").forEach((link) => {
  link.href = waUrl(link.dataset.wa);
});
document.querySelectorAll("[data-category-link]").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    $("searchInput").value = "";
    setCategory(link.dataset.categoryLink);
  }),
);
document.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (!$("mobileMenu").hidden) toggleMenu(false);
    if (
      state.category !== "all" &&
      ["home", "about", "skills", "alur"].includes(target.id)
    )
      setCategory("all", { scroll: false });
    const url = new URL(location.href);
    url.hash = hash;
    window.history.pushState({}, "", url);
    scrollToNode(target);
    if (link.classList.contains("skip-link")) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  }),
);
window.addEventListener("popstate", () => {
  setCategory(categoryFromUrl(new URL(location.href)), {
    history: false,
    scroll: false,
  });
});
$("searchInput").addEventListener("input", () => {
  state.limit = 9;
  renderCatalog();
});
$("loadMoreBtn").addEventListener("click", () => {
  const previousCount = $("portfolioGrid").children.length;
  state.limit += 9;
  renderCatalog();
  $("portfolioGrid")
    .children[previousCount]?.querySelector("button")
    ?.focus({ preventScroll: true });
});
categories.forEach(([key, label]) => {
  const filter = button(label, "filter-btn", () => setCategory(key));
  filter.dataset.category = key;
  $("filterContainer").append(filter);
  if (key !== "all") {
    const option = element("option", "", label);
    option.value = key;
    $("addCategory").append(option);
  }
});
document
  .querySelectorAll("[data-close]")
  .forEach((node) =>
    node.addEventListener("click", () => $(node.dataset.close).close()),
  );
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (dialog.id === "detailModal") $("modalViewer").replaceChildren();
    if (dialog.id === "addModal") $("addPassword").value = "";
  });
});

// Existing admin contract: UI visibility does not grant server authorization.
function setAdmin(enabled) {
  state.admin = enabled;
  $("adminAddBtn").hidden = !enabled;
  renderCatalog();
}
let logoClicks = 0,
  logoTimer;
$("logoTrigger").addEventListener("click", () => {
  clearTimeout(logoTimer);
  if (++logoClicks >= 3) {
    setAdmin(!state.admin);
    logoClicks = 0;
  }
  logoTimer = setTimeout(() => {
    logoClicks = 0;
  }, 1000);
});
$("adminAddBtn").addEventListener("click", () => {
  $("adminStatus").textContent = "";
  showDialog("addModal");
});

async function adminRequest(payload) {
  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(90000),
  });
  if (!response.ok)
    throw new Error(
      "Server belum dapat dihubungi. Cek katalog sebelum mencoba lagi.",
    );
  const result = await response.json();
  if (result.result !== "success")
    throw new Error(
      result.message || "Permintaan ditolak. Periksa password admin.",
    );
  return result;
}
async function deleteProject(project) {
  const password = prompt(`Password admin untuk menghapus "${project.title}":`);
  if (
    !password ||
    !confirm(
      `Hapus "${project.title}" dari katalog Google Sheets? Tindakan ini tidak dapat dibatalkan melalui situs.`,
    )
  )
    return;
  try {
    await adminRequest({ action: "delete", id: project.id, password });
    await loadCatalog();
  } catch (error) {
    alert(
      error.name === "TimeoutError"
        ? "Belum ada konfirmasi dari server. Periksa katalog sebelum mencoba lagi."
        : error.message,
    );
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File tidak bisa dibaca."));
    reader.readAsDataURL(file);
  });
}
async function prepareFile(file) {
  const base64 = await readFile(file);
  if (file.type === "application/pdf")
    return { name: file.name, type: file.type, base64 };
  const image = new Image();
  image.src = base64;
  try {
    await image.decode();
  } catch {
    throw new Error(`Gambar "${file.name}" tidak bisa dibaca.`);
  }
  const canvas = document.createElement("canvas");
  const ratio = Math.min(1, 1200 / image.width, 1600 / image.height);
  canvas.width = Math.round(image.width * ratio);
  canvas.height = Math.round(image.height * ratio);
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return {
    name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
    type: "image/jpeg",
    base64: canvas.toDataURL("image/jpeg", 0.82),
  };
}
$("addPortoForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if ($("submitBtn").disabled) return;
  const inputFiles = [...$("addFiles").files];
  if (
    inputFiles.length > 10 ||
    inputFiles.some(
      (file) =>
        file.size > 15 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(
          file.type,
        ),
    )
  ) {
    $("adminStatus").textContent =
      "Pilih maksimal 10 file JPG, PNG, WebP, atau PDF; maksimal 15 MB per file.";
    return;
  }
  $("submitBtn").disabled = true;
  $("adminStatus").textContent = "Menyiapkan file dan mengupload karya...";
  try {
    const files = [];
    for (const file of inputFiles) files.push(await prepareFile(file));
    await adminRequest({
      password: $("addPassword").value,
      title: $("addTitle").value.trim(),
      category: $("addCategory").value,
      categoryLabel: $("addCategory").selectedOptions[0].textContent,
      tools: $("addTools").value.trim(),
      estTime: $("addEstTime").value.trim(),
      desc: $("addDesc").value.trim(),
      files,
    });
    $("addPortoForm").reset();
    $("addModal").close();
    await loadCatalog();
  } catch (error) {
    $("adminStatus").textContent =
      error.name === "TimeoutError" || error instanceof TypeError
        ? "Belum ada konfirmasi dari server. Cek katalog sebelum mengupload ulang agar tidak duplikat."
        : error.message;
  } finally {
    $("submitBtn").disabled = false;
    $("addPassword").value = "";
  }
});

updatePageMode();
state.admin =
  new URL(location.href).searchParams.get("admin") === "true" ||
  location.hash === "#admin";
$("adminAddBtn").hidden = !state.admin;
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  document.body.classList.add("motion-ready");
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((node) => observer.observe(node));
}
try {
  const manifest = await fetch("assets/web/manifest.json");
  if (manifest.ok) state.images = await manifest.json();
} catch {
  /* Original image URLs remain available. */
}
loadCatalog();

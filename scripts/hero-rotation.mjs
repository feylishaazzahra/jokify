export const HERO_ROTATION_MS = 10_000;

// TEMPLATE: replace these entries with the final hero work selections.
export const heroWorks = [
  {
    title: "Dulizzert",
    category: "Brand identity",
    href: "?cat=logo-packaging#katalog",
    src: "assets/web/dulizzert-mockup.webp",
    alt: "Mockup identitas visual Dulizzert",
    position: "center 48%",
  },
  {
    title: "Waypoint",
    category: "Menu design",
    href: "?cat=menu-design#katalog",
    src: "assets/web/waypoint-menu1.webp",
    alt: "Desain menu Waypoint",
    position: "center",
  },
  {
    title: "FOMO",
    category: "Social media",
    href: "?cat=social-media#katalog",
    src: "assets/web/fomo-1.webp",
    alt: "Desain carousel FOMO",
    position: "center",
  },
];

export function nextHeroWorkIndex(current, total) {
  if (!Number.isInteger(total) || total <= 0) return 0;
  return (current + 1) % total;
}

export function initHeroRotation(documentRef = document, windowRef = window) {
  const card = documentRef.querySelector("#heroWork");
  const image = documentRef.querySelector("#heroWorkImage");
  const title = documentRef.querySelector("#heroWorkTitle");
  const category = documentRef.querySelector("#heroWorkCategory");
  const indexLabel = documentRef.querySelector("#heroWorkIndex");
  if (!card || !image || !title || !category || !indexLabel) return null;

  heroWorks.slice(1).forEach((work) => {
    const preload = new Image();
    preload.src = work.src;
  });

  let currentIndex = 0;
  let intervalId = null;
  let transitionId = null;

  const render = (work, index) => {
    card.href = work.href;
    card.setAttribute("aria-label", `Lihat karya ${work.title}`);
    image.src = work.src;
    image.alt = work.alt;
    image.style.objectPosition = work.position;
    title.textContent = work.title;
    category.textContent = work.category;
    indexLabel.textContent = `${String(index + 1).padStart(2, "0")} / ${String(heroWorks.length).padStart(2, "0")}`;
  };

  const advance = () => {
    card.classList.add("is-switching");
    transitionId = windowRef.setTimeout(() => {
      currentIndex = nextHeroWorkIndex(currentIndex, heroWorks.length);
      render(heroWorks[currentIndex], currentIndex);
      card.classList.remove("is-switching");
      transitionId = null;
    }, 180);
  };

  const stop = () => {
    if (intervalId !== null) windowRef.clearInterval(intervalId);
    intervalId = null;
  };
  const start = () => {
    if (intervalId === null && !documentRef.hidden) {
      intervalId = windowRef.setInterval(advance, HERO_ROTATION_MS);
    }
  };

  card.addEventListener("mouseenter", stop);
  card.addEventListener("mouseleave", start);
  card.addEventListener("focusin", stop);
  card.addEventListener("focusout", start);
  documentRef.addEventListener("visibilitychange", () => {
    if (documentRef.hidden) stop();
    else start();
  });
  start();

  return () => {
    stop();
    if (transitionId !== null) windowRef.clearTimeout(transitionId);
  };
}

if (typeof document !== "undefined") initHeroRotation();

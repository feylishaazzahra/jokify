export const HERO_ROTATION_MS = 10_000;

export const heroWorks = [
  {
    title: "Training Legislatif Booklet & Print Mockup",
    category: "Booklet & Modul",
    href: "?cat=booklet#katalog",
    src: "assets/web/training-legislatif-mockup1.webp",
    alt: "Mockup booklet cetak Training Legislatif",
    position: "center",
  },
  {
    title: "Evercurse Event Merchandise & ID Kit",
    category: "Lanyard & ID Card",
    href: "?cat=idcard-lanyard#katalog",
    src: "assets/web/evercurse-mockup.webp",
    alt: "Mockup merchandise dan ID kit acara Evercurse",
    position: "center",
  },
  {
    title: "Banner Sidang Tema Powerpuff",
    category: "Banner Design",
    href: "?cat=banner-design#katalog",
    src: "https://lh3.googleusercontent.com/d/1wujZPikVYGHmXioQ5xwIMzSH5Sk5OPRn",
    alt: "Banner sidang bertema Powerpuff",
    position: "center",
  },
  {
    title: "Twibbon MPLS Tema Fantasi",
    category: "Twibbon",
    href: "?cat=twibbon#katalog",
    src: "https://lh3.googleusercontent.com/d/1OBVH3PnQIEBBLOpO11d1O9E7ourzqxxg",
    alt: "Twibbon MPLS bertema fantasi",
    position: "center",
  },
  {
    title: "ID Card Pengabdian Masyarakat Biru",
    category: "Lanyard & ID Card",
    href: "?cat=idcard-lanyard#katalog",
    src: "https://lh3.googleusercontent.com/d/1YKz9oSFxrEMRMtk6tOStfV6LEU0eTgHH",
    alt: "ID card biru untuk kegiatan pengabdian masyarakat",
    position: "center",
  },
  {
    title: "Feeds Instagram Informasi",
    category: "Social Media",
    href: "?cat=social-media#katalog",
    src: "https://lh3.googleusercontent.com/d/1h3wGTdH-x_qRX04sonSp7edX2ezSZK4l",
    alt: "Desain feeds Instagram informasi",
    position: "center",
  },
  {
    title: "Feeds Instagram Recap Kegiatan Tema Detektif",
    category: "Social Media",
    href: "?cat=social-media#katalog",
    src: "https://lh3.googleusercontent.com/d/1S_OOtYOmv1BM0tUnzhwo75vI6RBOX5l7",
    alt: "Desain feeds Instagram recap kegiatan bertema detektif",
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

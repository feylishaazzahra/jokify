import { scrollProgress } from "./scroll-math.mjs";

// Progressive enhancement only: no wheel/touch interception or synthetic scroll.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
const systemReduced = matchMedia("(prefers-reduced-motion: reduce)");
const desktop = matchMedia("(min-width: 900px) and (min-height: 640px)");
const story = document.querySelector("[data-horizontal-story]");
const stage = story?.querySelector(".story-stage");
const track = story?.querySelector(".story-track");
const clip = story?.querySelector(".story-clip");
const marquee = document.querySelector(".contact-marquee-track");
const toggle = document.getElementById("motionToggle");
let userReduced = false;
let travel = 0;
let frame = null;

function paint() {
  frame = null;
  if (!document.body.classList.contains("scroll-enhanced")) return;
  if (story && track) {
    const progress = scrollProgress(story.getBoundingClientRect().top, travel);
    track.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;
  }
  if (marquee) {
    const top = marquee.parentElement.getBoundingClientRect().top;
    const progress = scrollProgress(top - innerHeight, innerHeight * 1.5);
    marquee.style.transform = `translate3d(${-progress * 160}px, 0, 0)`;
  }
}
function schedulePaint() {
  if (frame === null) frame = requestAnimationFrame(paint);
}
function measure() {
  const reduced = systemReduced.matches || userReduced;
  const enabled = desktop.matches && !reduced;
  document.body.classList.toggle("motion-off", reduced);
  document.body.classList.toggle("scroll-enhanced", enabled);
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(reduced));
    toggle.disabled = systemReduced.matches;
    toggle.textContent = systemReduced.matches
      ? "Animasi dikurangi oleh perangkat"
      : "Kurangi animasi";
  }
  if (story && track && clip && stage) {
    track.style.removeProperty("transform");
    travel = enabled ? Math.max(0, track.scrollWidth - clip.clientWidth) : 0;
    story.style.setProperty(
      "--story-height",
      `${stage.offsetHeight + travel}px`,
    );
  }
  if (!enabled) {
    marquee?.style.removeProperty("transform");
  }
  schedulePaint();
}
toggle?.addEventListener("click", () => {
  userReduced = !userReduced;
  measure();
});
systemReduced.addEventListener("change", measure);
desktop.addEventListener("change", measure);
window.addEventListener("resize", measure);
window.addEventListener("scroll", schedulePaint, { passive: true });
// A category route hides the landing page; remeasure when returning home.
document.addEventListener("jokify:page-mode", measure);
measure();
document.fonts.ready.then(measure);

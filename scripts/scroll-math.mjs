export function scrollProgress(sectionTop, distance) {
  if (distance <= 0) return 0;
  return Math.min(1, Math.max(0, -sectionTop / distance));
}

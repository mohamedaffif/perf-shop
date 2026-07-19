// Mirrors the duration/easing tokens in app/animations.css so GSAP tweens
// read as the same motion language as the existing CSS transitions.
export const EASE_STANDARD = "power2.out"; // ~ cubic-bezier(0.4, 0, 0.2, 1)
export const EASE_EMPHASIZED = "power3.out"; // ~ cubic-bezier(0.2, 0, 0, 1)

export const DURATION_NORMAL = 0.25; // matches --duration-normal
export const DURATION_SLOW = 0.4; // matches --duration-slow

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

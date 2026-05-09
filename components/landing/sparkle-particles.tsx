/**
 * Decorative floating sparkles for the landing hero. CSS-only, server
 * component, no JS bundle cost. Lives behind content (z-0) and is
 * pointer-events disabled. Animation honors prefers-reduced-motion via
 * the global media query in app/globals.css (animation duration → 0.01ms).
 *
 * Per-instance position / color / delay / duration are passed via inline
 * style. Tailwind would not pick up dynamic string concat (e.g. `bg-${x}`)
 * during JIT scan, so we set background-color from the literal hex tokens
 * defined in app/globals.css. Keep this list short — too many particles
 * pollute the canvas and degrade perceived focus.
 */

type Sparkle = {
  top: string;
  left: string;
  /** Pixel size for both width & height. */
  size: number;
  /** Literal CSS color (rgba/hex). Mirrors design tokens. */
  color: string;
  /** Animation delay (s). */
  delay: string;
  /** Animation duration (s). Stagger across the field for organic feel. */
  duration: string;
};

const SPARKLES: Sparkle[] = [
  { top: "12%", left: "8%", size: 4, color: "rgba(59, 184, 247, 0.55)", delay: "0s", duration: "7s" },
  { top: "22%", left: "92%", size: 5, color: "rgba(16, 185, 129, 0.45)", delay: "1.2s", duration: "8s" },
  { top: "68%", left: "12%", size: 4, color: "rgba(192, 132, 252, 0.5)", delay: "2.1s", duration: "9s" },
  { top: "78%", left: "84%", size: 4, color: "rgba(59, 184, 247, 0.45)", delay: "0.6s", duration: "6.5s" },
  { top: "44%", left: "4%", size: 3, color: "rgba(56, 189, 248, 0.4)", delay: "3.4s", duration: "10s" },
  { top: "32%", left: "62%", size: 4, color: "rgba(251, 191, 36, 0.4)", delay: "1.8s", duration: "7.5s" },
  { top: "88%", left: "48%", size: 4, color: "rgba(16, 185, 129, 0.5)", delay: "2.8s", duration: "8.5s" },
  { top: "8%", left: "72%", size: 3, color: "rgba(59, 184, 247, 0.4)", delay: "0.3s", duration: "9.5s" },
];

export function SparkleParticles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="animate-float absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            animationDelay: s.delay,
            animationDuration: s.duration,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

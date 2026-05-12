"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Decorative sparkle field for the landing mesh. Each dot runs the global
 * `sparkle-wander` keyframe (drift + twinkle). The whole layer eases slightly
 * toward the pointer for depth — disabled when `prefers-reduced-motion` is set
 * (global CSS also collapses animation durations).
 */

type Sparkle = {
  top: string;
  left: string;
  size: number;
  color: string;
  delay: string;
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
  { top: "52%", left: "38%", size: 3, color: "rgba(192, 132, 252, 0.38)", delay: "4.1s", duration: "11s" },
  { top: "18%", left: "42%", size: 2, color: "rgba(59, 184, 247, 0.35)", delay: "2.4s", duration: "8.2s" },
];

export function SparkleParticles() {
  const reducedMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 52, damping: 28, mass: 0.35 });
  const springY = useSpring(my, { stiffness: 52, damping: 28, mass: 0.35 });

  useEffect(() => {
    if (reducedMotion) return;

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(nx * 22);
      my.set(ny * 16);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, mx, my]);

  const dots = (
    <>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="landing-sparkle-dot absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        />
      ))}
    </>
  );

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {dots}
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
      style={{ x: springX, y: springY }}
    >
      {dots}
    </motion.div>
  );
}

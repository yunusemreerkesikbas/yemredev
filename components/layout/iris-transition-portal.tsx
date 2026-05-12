"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { animate, motion, useMotionTemplate, useMotionValue } from "motion/react";

/** Full iris sweep — slightly longer so acceleration reads legibly at the end. */
export const IRIS_DURATION = 1.14;

export const OVERLAY_Z = 100;

const HOLE_R_FINAL = 28;

/** Smooth accel / soft landing — avoids the harsh “snap” of an ultra-sharp ease end. */
const EASE_LENS = [0.26, 0.06, 0.2, 1] as const;

const FAB_REPLICA_CLASS =
  "pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[101] flex h-14 w-14 items-center justify-center rounded-full border border-white/16 bg-gradient-to-br from-zinc-900/95 via-zinc-950/95 to-black/95 text-white shadow-[0_10px_40px_-10px_rgba(59,184,247,0.42),0_0_0_1px_rgba(0,0,0,0.35)_inset,0_1px_0_rgba(255,255,255,0.1)_inset] backdrop-blur-xl";

export type IrisTransitionVariant = "toFab" | "toLanding";

type IrisTransitionPortalProps = {
  vw: number;
  vh: number;
  maskId: string;
  variant: IrisTransitionVariant;
  onComplete: () => void;
};

function irisGeometry(vw: number, vh: number) {
  const cxMid = vw / 2;
  const cyMid = vh / 2;
  const rLarge = Math.hypot(vw, vh) / 2 + 52;
  return { cxMid, cyMid, rLarge };
}

/** Bottom-right FAB anchor when layout probe has not laid out yet (mobile WebKit). */
function fallbackFabCenter(vw: number, vh: number) {
  const edge = 16;
  const half = 28;
  return { cx: vw - edge - half, cy: vh - edge - half };
}

/**
 * Full-screen iris: CSS mask (radial) animated with Motion — avoids iOS Safari
 * bugs with SVG `<mask>` + animated `<circle>`. Dim layer + rim glow + vignette.
 */
export function IrisTransitionPortal({
  vw,
  vh,
  maskId: _maskId,
  variant,
  onComplete,
}: IrisTransitionPortalProps) {
  void _maskId;
  const probeRef = useRef<HTMLDivElement>(null);
  const [fabCenter, setFabCenter] = useState<{ cx: number; cy: number } | null>(
    null,
  );
  const finishedRef = useRef(false);

  const { cxMid, cyMid, rLarge } = irisGeometry(vw, vh);

  const cxMv = useMotionValue(cxMid);
  const cyMv = useMotionValue(cyMid);
  const rMv = useMotionValue(rLarge);
  /** Skip intro: peripheral dim toward FAB before iris fully dominates (0 → peak → settle). */
  const focusPeripheryOpacity = useMotionValue(0);

  const dimMask = useMotionTemplate`radial-gradient(circle ${rMv}px at ${cxMv}px ${cyMv}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 82%, rgba(9,9,11,0.55) 91%, rgba(9,9,11,0.88) 97%, rgba(9,9,11,0.97) 100%)`;

  const rimGlow = useMotionTemplate`radial-gradient(circle ${rMv}px at ${cxMv}px ${cyMv}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 90%, rgba(59,184,247,0.38) 96.5%, rgba(147,197,253,0.12) 99%, rgba(0,0,0,0) 100%)`;

  const handleCircleComplete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete();
  }, [onComplete]);

  useLayoutEffect(() => {
    const el = probeRef.current;
    if (!el) return;

    const applyRect = () => {
      const r = el.getBoundingClientRect();
      const next =
        r.width > 0 && r.height > 0
          ? { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
          : fallbackFabCenter(vw, vh);
      setFabCenter((prev) => {
        if (
          prev &&
          Math.hypot(prev.cx - next.cx, prev.cy - next.cy) < 0.75
        ) {
          return prev;
        }
        return next;
      });
    };

    applyRect();
    const id0 = requestAnimationFrame(() => {
      requestAnimationFrame(applyRect);
    });
    return () => cancelAnimationFrame(id0);
  }, [vw, vh]);

  useLayoutEffect(() => {
    if (!fabCenter) return;
    if (variant === "toFab") {
      cxMv.set(cxMid);
      cyMv.set(cyMid);
      rMv.set(rLarge);
      focusPeripheryOpacity.set(0);
    } else {
      cxMv.set(fabCenter.cx);
      cyMv.set(fabCenter.cy);
      rMv.set(HOLE_R_FINAL);
    }
  }, [fabCenter, variant, cxMid, cyMid, rLarge, cxMv, cyMv, rMv, focusPeripheryOpacity]);

  useEffect(() => {
    if (!fabCenter) return;

    let cancelled = false;

    const target =
      variant === "toFab"
        ? { cx: fabCenter.cx, cy: fabCenter.cy, r: HOLE_R_FINAL }
        : { cx: cxMid, cy: cyMid, r: rLarge };

    finishedRef.current = false;

    const opts = {
      duration: IRIS_DURATION,
      ease: EASE_LENS,
    } as const;

    const runners = [
      animate(cxMv, target.cx, opts),
      animate(cyMv, target.cy, opts),
      animate(rMv, target.r, opts),
    ];

    if (variant === "toFab") {
      runners.push(
        animate(focusPeripheryOpacity, [0, 0.94, 0.36], {
          duration: IRIS_DURATION,
          times: [0, 0.34, 1],
          ease: [EASE_LENS, EASE_LENS],
        }),
      );
    }

    const fallbackMs = Math.round(IRIS_DURATION * 1000) + 320;
    const fallbackTimer = window.setTimeout(() => {
      if (cancelled) return;
      handleCircleComplete();
    }, fallbackMs);

    Promise.all(runners)
      .then(() => {
        window.clearTimeout(fallbackTimer);
        if (cancelled) return;
        handleCircleComplete();
      })
      .catch(() => {
        window.clearTimeout(fallbackTimer);
        if (cancelled) return;
        handleCircleComplete();
      });

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      runners.forEach((ctrl) => ctrl.stop());
    };
  }, [
    fabCenter,
    variant,
    cxMid,
    cyMid,
    rLarge,
    cxMv,
    cyMv,
    rMv,
    focusPeripheryOpacity,
    handleCircleComplete,
  ]);

  return (
    <div
      className="fixed inset-0 touch-none overscroll-contain"
      style={{
        zIndex: OVERLAY_Z,
        // Until FAB center is measured, avoid a full-screen hit target — some
        // mobile WebKit builds keep the first composited frame and block taps
        // on the route underneath (e.g. landing chat input).
        pointerEvents: fabCenter !== null ? "auto" : "none",
      }}
      aria-hidden
    >
      <div
        ref={probeRef}
        className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[99] h-14 w-14 opacity-0"
        aria-hidden
      />

      {fabCenter !== null ? (
        <>
          {variant === "toFab" ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 will-change-[opacity]"
              style={{
                opacity: focusPeripheryOpacity,
                backgroundImage: `radial-gradient(circle ${Math.max(vw, vh) * 0.92}px at ${fabCenter.cx}px ${fabCenter.cy}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 11%, rgba(9,9,11,0.42) 46%, rgba(9,9,11,0.72) 72%, rgba(6,7,12,0.88) 100%)`,
              }}
            />
          ) : null}

          <motion.div
            aria-hidden
            className="absolute inset-0 will-change-[mask-image]"
            style={{
              backgroundColor: "rgba(9, 9, 11, 0.94)",
              maskImage: dimMask,
              WebkitMaskImage: dimMask,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "0 0",
              WebkitMaskPosition: "0 0",
            }}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-screen will-change-[background-image]"
            style={{
              backgroundImage: rimGlow,
              opacity: 0.85,
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_min(45vw,420px)_rgba(0,0,0,0.55)]"
          />

          {variant === "toFab" ? (
            <motion.div
              aria-hidden
              className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[100] flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/55 shadow-[0_0_36px_4px_rgba(59,184,247,0.45),0_0_0_1px_rgba(255,255,255,0.08)_inset]"
              initial={{ scale: 0.78, opacity: 0 }}
              animate={{
                scale: [0.78, 1.12, 1],
                opacity: [0, 1, 0.55],
              }}
              transition={{
                duration: IRIS_DURATION * 0.5,
                times: [0, 0.52, 1],
                ease: [0.2, 0.9, 0.2, 1],
              }}
            />
          ) : null}

          {variant === "toFab" ? (
            <motion.div
              className={FAB_REPLICA_CLASS}
              initial={{ opacity: 1, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: IRIS_DURATION * 0.55,
                ease: EASE_LENS,
              }}
            >
              <FabReplicaInner />
            </motion.div>
          ) : (
            <motion.div
              className={FAB_REPLICA_CLASS}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.86 }}
              transition={{
                duration: IRIS_DURATION * 0.38,
                ease: [0.22, 1, 0.34, 1],
              }}
            >
              <FabReplicaInner />
            </motion.div>
          )}
        </>
      ) : null}
    </div>
  );
}

function FabReplicaInner() {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/15 opacity-60 blur-xl"
      />
      <Bot
        aria-hidden
        className="relative z-10 h-6 w-6 text-primary drop-shadow-[0_0_6px_rgba(59,184,247,0.6)]"
        strokeWidth={1.75}
      />
      <span
        aria-hidden
        className="animate-pulse-slow absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.7)]"
      />
    </>
  );
}

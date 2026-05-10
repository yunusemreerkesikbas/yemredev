"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { motion } from "motion/react";

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

/**
 * Full-screen SVG iris: mask black circle = transparent hole through the dim layer.
 * `toFab`: hole shrinks from viewport center toward the FAB probe (Skip Intro).
 * `toLanding`: hole grows from FAB toward viewport center (reverse), then route change.
 */
export function IrisTransitionPortal({
  vw,
  vh,
  maskId,
  variant,
  onComplete,
}: IrisTransitionPortalProps) {
  const probeRef = useRef<HTMLDivElement>(null);
  const [fabCenter, setFabCenter] = useState<{ cx: number; cy: number } | null>(
    null,
  );
  const finishedRef = useRef(false);

  const handleCircleComplete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete();
  }, [onComplete]);

  useLayoutEffect(() => {
    const el = probeRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setFabCenter({ cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
  }, [vw, vh]);

  const { cxMid, cyMid, rLarge } = irisGeometry(vw, vh);

  const initial = fabCenter
    ? variant === "toFab"
      ? { cx: cxMid, cy: cyMid, r: rLarge }
      : { cx: fabCenter.cx, cy: fabCenter.cy, r: HOLE_R_FINAL }
    : null;

  const target = fabCenter
    ? variant === "toFab"
      ? { cx: fabCenter.cx, cy: fabCenter.cy, r: HOLE_R_FINAL }
      : { cx: cxMid, cy: cyMid, r: rLarge }
    : null;

  return (
    <div
      className="fixed inset-0 touch-none overscroll-contain"
      style={{
        zIndex: OVERLAY_Z,
        pointerEvents: "auto",
      }}
      aria-hidden
    >
      <div
        ref={probeRef}
        className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[99] h-14 w-14 opacity-0"
        aria-hidden
      />

      {fabCenter !== null && initial && target ? (
        <>
          <svg
            width={vw}
            height={vh}
            className="absolute left-0 top-0 block"
            aria-hidden
          >
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={vw}
                height={vh}
              >
                <rect width={vw} height={vh} fill="white" />
                <motion.circle
                  fill="black"
                  initial={initial}
                  animate={target}
                  transition={{
                    duration: IRIS_DURATION,
                    ease: EASE_LENS,
                  }}
                  onAnimationComplete={handleCircleComplete}
                />
              </mask>
            </defs>
            <rect
              width={vw}
              height={vh}
              fill="rgba(9, 9, 11, 0.94)"
              mask={`url(#${maskId})`}
            />
          </svg>

          {variant === "toFab" ? (
            <motion.div
              className={FAB_REPLICA_CLASS}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: IRIS_DURATION * 0.52,
                duration: IRIS_DURATION * 0.45,
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

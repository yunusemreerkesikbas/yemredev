import { cn } from "@/lib/utils";
import { SparkleParticles } from "@/components/landing/sparkle-particles";

type MeshBackgroundProps = {
  /**
   * Adds an 800x800 primary blur orb pulsing in the viewport center.
   * Used on the landing page to anchor the AI assistant hero block.
   */
  withCenterPulse?: boolean;
  /**
   * Renders the corner-accent blobs (top-right primary, bottom-left emerald)
   * used on the bento dashboard. Off by default — landing only wants the pulse.
   */
  withCornerAccents?: boolean;
  /**
   * Atmospheric+ pass: layered SVG fractal-noise grain over the gradient.
   * Adds subtle texture so the dark canvas reads less "flat plastic".
   * Layout-shift safe (background-image only). Default: enabled.
   */
  withNoise?: boolean;
  /**
   * Atmospheric+ pass: floating accent dots scattered across the viewport.
   * CSS-only, motion-safe (animation halted by global reduced-motion query).
   * Default: disabled — opt in per page.
   */
  withSparkles?: boolean;
  className?: string;
};

/**
 * Decorative atmosphere layer. Sits at z-0, pointer-events disabled.
 * Always paired with `relative z-10` content above and a near-black body
 * background.
 *
 * Layer order (bottom → top):
 *   1. mesh gradient (3-stop radial)
 *   2. center pulse orb (landing) OR corner accents (bento/contact)
 *   3. sparkles (landing only)
 *   4. noise overlay (Atmospheric+ grain, blends via soft-light)
 *
 * Placement: routed behind page content from `LocaleShell` (landing vs app variant).
 * Variants:
 *  - landing: `withCenterPulse` + `withSparkles`
 *  - app routes: `withCornerAccents`
 */
export function MeshBackground({
  withCenterPulse = false,
  withCornerAccents = false,
  withNoise = true,
  withSparkles = false,
  className,
}: MeshBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      <div className="bg-mesh-gradient absolute inset-0 opacity-90" />

      {withCenterPulse ? (
        <div className="animate-pulse-slow absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
      ) : null}

      {withCornerAccents ? (
        <>
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-accent-emerald/[0.06] blur-[100px]" />
        </>
      ) : null}

      {withSparkles ? <SparkleParticles /> : null}

      {withNoise ? (
        <div className="noise-overlay absolute inset-0" />
      ) : null}
    </div>
  );
}

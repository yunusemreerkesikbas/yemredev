import { useTranslations } from "next-intl";
import { Briefcase } from "lucide-react";
import type { Experience } from "@/types/profile";
import { cn } from "@/lib/utils";

type ExperienceTimelineProps = {
  experience: Experience[];
  className?: string;
};

/**
 * Right column bento cell, full vertical span. The ONLY card in the home
 * dashboard that scrolls internally — a hard rule from DESIGN.md §7.2.
 * Sticky inner header + overflow-y-auto + no-scrollbar so the rest of the
 * page stays single-viewport on desktop.
 *
 * Vertical timeline rail is rendered via an absolutely-positioned `<span>`
 * (not a pseudo-element) so it composes safely with Tailwind utilities
 * across both themes.
 */
export function ExperienceTimeline({
  experience,
  className,
}: ExperienceTimelineProps) {
  const t = useTranslations("home.experience");

  return (
    <section
      className={cn(
        "glass-bento-surface relative flex flex-col overflow-hidden rounded-2xl lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-4",
        className,
      )}
    >
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-b from-[rgba(14,14,16,0.97)] via-[rgba(10,10,12,0.92)] to-[rgba(10,10,12,0.78)] px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Briefcase
            aria-hidden
            className="h-4 w-4 text-primary/90"
            strokeWidth={1.75}
          />
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70">
            {t("title")}
          </h2>
        </div>
      </header>

      <ol className="no-scrollbar relative flex-1 list-none overflow-y-auto px-5 py-4">
        <span
          aria-hidden
          className="absolute bottom-4 left-[26px] top-4 w-px bg-gradient-to-b from-white/25 via-white/12 to-transparent"
        />

        {experience.map((entry, idx) => (
          <li
            key={`${entry.company}-${entry.start}`}
            className={cn("relative pl-6", idx > 0 && "mt-5")}
          >
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-[rgba(12,12,14,0.95)]",
                idx === 0
                  ? "bg-primary shadow-[0_0_10px_rgba(59,184,247,0.75)]"
                  : "bg-white/45 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
              )}
            />
            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-white/55">
              <time dateTime={entry.start}>{entry.start}</time>
              <span aria-hidden> — </span>
              {entry.end === "present" ? (
                <span>{t("presentLabel")}</span>
              ) : (
                <time dateTime={entry.end}>{entry.end}</time>
              )}
              {entry.location ? (
                <>
                  <span aria-hidden> · </span>
                  <span>{entry.location}</span>
                </>
              ) : null}
            </p>
            <h3 className="mt-1 text-sm font-bold tracking-tight text-white">
              {entry.role}
            </h3>
            <p className="text-xs font-semibold text-white/70">{entry.company}</p>

            {entry.highlights.length > 0 ? (
              <ul className="mt-2 list-none space-y-1 p-0">
                {entry.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2 text-xs font-medium leading-relaxed text-white/75"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/70"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {entry.stack && entry.stack.length > 0 ? (
              <ul className="mt-2 flex list-none flex-wrap gap-1 p-0">
                {entry.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-white/12 bg-white/[0.07] px-1.5 py-0.5 text-[10px] font-semibold text-white/80"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

import { useTranslations } from "next-intl";
import { Layers } from "lucide-react";
import type { SkillGroup } from "@/types/profile";
import { BentoCard } from "./bento-card";
import { cn } from "@/lib/utils";

type TechStackProps = {
  skills: SkillGroup[];
  className?: string;
};

/**
 * Maps the canonical group label (English source-of-truth) to a translation
 * key under `home.techStack.groups`. Falls back to the source label if the
 * group is not in the known set — keeps content additions safe.
 */
const GROUP_KEY: Record<string, "languages" | "frameworks" | "tools"> = {
  Languages: "languages",
  Diller: "languages",
  Frameworks: "frameworks",
  "Framework'ler": "frameworks",
  Tools: "tools",
  Araçlar: "tools",
};

const GROUP_TONE = {
  languages: "text-accent-blue",
  frameworks: "text-primary",
  tools: "text-accent-purple",
} as const;

/**
 * Left-bottom bento cell (compact). Three skill groups (Languages / Frameworks /
 * Tools), each with a small accent header and a chip list. Body scrolls vertically
 * when it exceeds the grid cell (desktop single-viewport layout).
 */
export function TechStack({ skills, className }: TechStackProps) {
  const t = useTranslations("home.techStack");

  return (
    <BentoCard
      className={cn(
        "min-h-0 lg:min-h-0 lg:col-start-1 lg:col-span-1 lg:row-start-4 lg:row-span-3",
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border pb-3 dark:border-white/10">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
          {t("title")}
        </h2>
        <Layers
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 text-primary/70 sm:h-4 sm:w-4"
          strokeWidth={1.75}
        />
      </header>

      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pt-3 sm:gap-3.5">
        {skills.map((group) => {
          const key = GROUP_KEY[group.group];
          const tone = key ? GROUP_TONE[key] : "text-muted-foreground";
          const heading = key ? t(`groups.${key}`) : group.group;

          return (
            <div key={group.group}>
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("h-1 w-1 rounded-full bg-current", tone)}
                />
                <span
                  className={cn(
                    "font-mono text-[9px] font-bold uppercase tracking-[0.16em] sm:text-[10px]",
                    tone,
                  )}
                >
                  {heading}
                </span>
              </div>
              <ul className="flex list-none flex-wrap gap-1 p-0">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-foreground/[0.06] px-1.5 py-0.5 text-[11px] font-semibold text-foreground/90 sm:px-2 sm:text-xs dark:border-white/12 dark:bg-white/[0.07] dark:text-white/88"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}

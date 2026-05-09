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
 * Left-bottom bento cell. Three skill groups (Languages / Frameworks /
 * Tools), each with a small accent header and a chip list. Text-first —
 * no third-party brand-logo SVGs needed for Phase 3.
 */
export function TechStack({ skills, className }: TechStackProps) {
  const t = useTranslations("home.techStack");

  return (
    <BentoCard
      className={cn(
        "lg:col-start-1 lg:col-span-1 lg:row-start-3 lg:row-span-4",
        className,
      )}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {t("title")}
        </h2>
        <Layers
          aria-hidden
          className="h-4 w-4 text-primary/70"
          strokeWidth={1.75}
        />
      </header>

      <div className="mt-4 flex flex-1 flex-col gap-5">
        {skills.map((group) => {
          const key = GROUP_KEY[group.group];
          const tone = key ? GROUP_TONE[key] : "text-white/60";
          const heading = key ? t(`groups.${key}`) : group.group;

          return (
            <div key={group.group}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("h-1 w-1 rounded-full bg-current", tone)}
                />
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
                    tone,
                  )}
                >
                  {heading}
                </span>
              </div>
              <ul className="flex list-none flex-wrap gap-1.5 p-0">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/12 bg-white/[0.08] px-2 py-1 text-xs font-semibold text-white/90"
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

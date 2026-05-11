"use client";

import { useTranslations } from "next-intl";
import {
  Briefcase,
  BrainCircuit,
  Building2,
  Code2,
  FileText,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ChipKey =
  | "skills"
  | "github"
  | "experience"
  | "resume"
  | "craftive"
  | "sap";

type Chip = {
  key: ChipKey;
  Icon: LucideIcon;
  iconClass: string;
};

const CHIPS: Chip[] = [
  { key: "skills", Icon: BrainCircuit, iconClass: "text-accent-blue" },
  { key: "github", Icon: Code2, iconClass: "text-accent-emerald" },
  { key: "experience", Icon: Briefcase, iconClass: "text-accent-purple" },
  { key: "resume", Icon: FileText, iconClass: "text-accent-amber" },
  { key: "craftive", Icon: LayoutGrid, iconClass: "text-primary" },
  { key: "sap", Icon: Building2, iconClass: "text-accent-emerald" },
];

type QuickActionChipsProps = {
  prompts: Record<ChipKey, string>;
  onChipClick: (promptText: string) => void;
  disabled?: boolean;
  hidden?: boolean;
};

export function QuickActionChips({
  prompts,
  onChipClick,
  disabled = false,
  hidden = false,
}: QuickActionChipsProps) {
  const t = useTranslations("landing.chips");

  return (
    <ul
      aria-label={t("listLabel")}
      aria-hidden={hidden}
      className={cn(
        "flex w-full min-w-0 list-none flex-wrap justify-center gap-2.5 p-0 transition-all duration-300",
        hidden && "pointer-events-none max-h-0 overflow-hidden opacity-0",
      )}
    >
      {CHIPS.map(({ key, Icon, iconClass }) => (
        <li key={key} className="inline-flex">
          <button
            type="button"
            disabled={disabled || hidden}
            onClick={() => onChipClick(prompts[key])}
            className="group inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-2 text-left text-sm font-medium tracking-tight text-foreground/75 backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-primary/25 hover:bg-foreground/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:px-4 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white"
          >
            <Icon
              aria-hidden
              className={cn(
                "h-[18px] w-[18px] opacity-75 transition-opacity duration-200 group-hover:opacity-100",
                iconClass,
              )}
              strokeWidth={1.75}
            />
            <span className="min-w-0 whitespace-normal break-words text-pretty">
              {t(`items.${key}`)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

import { useTranslations } from "next-intl";
import {
  Briefcase,
  BrainCircuit,
  Code2,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Chip = {
  key: "skills" | "github" | "experience" | "resume";
  Icon: LucideIcon;
  iconClass: string;
};

/**
 * Static visual prompt chips shown beneath the hero. In Phase 2 these are
 * non-interactive — the design intent is to suggest the AI assistant's
 * capabilities. Phase 6 wires onClick to pre-fill the chat input + send.
 *
 * Semantic <ul>/<li> per Vercel guideline (semantic HTML before ARIA).
 */
const CHIPS: Chip[] = [
  { key: "skills", Icon: BrainCircuit, iconClass: "text-accent-blue" },
  { key: "github", Icon: Code2, iconClass: "text-accent-emerald" },
  { key: "experience", Icon: Briefcase, iconClass: "text-accent-purple" },
  { key: "resume", Icon: FileText, iconClass: "text-accent-amber" },
];

export function QuickActionChips() {
  const t = useTranslations("landing.chips");

  return (
    <ul
      aria-label={t("listLabel")}
      className="flex w-full list-none flex-wrap justify-center gap-2.5 p-0"
    >
      {CHIPS.map(({ key, Icon, iconClass }) => (
        <li
          key={key}
          className="group inline-flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium tracking-tight text-white/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <Icon
            aria-hidden
            className={cn(
              "h-[18px] w-[18px] opacity-75 transition-opacity duration-200 group-hover:opacity-100",
              iconClass,
            )}
            strokeWidth={1.75}
          />
          <span>{t(`items.${key}`)}</span>
        </li>
      ))}
    </ul>
  );
}

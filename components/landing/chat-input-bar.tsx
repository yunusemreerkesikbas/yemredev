"use client";

import { type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatInputStatus = "idle" | "submitted" | "streaming" | "error";

type ChatInputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  status: ChatInputStatus;
};

export function ChatInputBar({
  value,
  onChange,
  onSubmit,
  status,
}: ChatInputBarProps) {
  const t = useTranslations("landing.input");

  const isBusy = status === "submitted" || status === "streaming";
  const canSend = value.trim().length > 0 && !isBusy;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group/search relative w-full min-w-0"
      aria-label={t("ariaLabel")}
    >
      <div className="relative flex w-full min-w-0 items-center rounded-xl border border-border bg-card-dark p-1 transition-colors duration-300 group-focus-within/search:border-primary/45 dark:border-white/10">
        <div className="flex shrink-0 items-center justify-center pl-4 pr-3 text-muted-foreground transition-colors duration-300 group-focus-within/search:text-primary">
          <Sparkles aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <input
            type="text"
            name="prompt"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoComplete="off"
            inputMode="text"
            spellCheck={false}
            disabled={isBusy}
            placeholder={t("placeholder")}
            aria-label={t("ariaLabel")}
            className="caret-primary box-border w-full min-w-0 border-none bg-transparent py-4 text-base font-medium tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:opacity-60 sm:text-lg"
          />
        </div>

        <div className="flex shrink-0 items-center pr-2">
          <button
            type="submit"
            aria-label={t("sendLabel")}
            disabled={!canSend}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <ArrowUp aria-hidden className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="font-tabular mt-4 flex items-center justify-between px-2 font-mono text-xs uppercase tracking-wider text-muted-foreground/70">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "animate-pulse-slow h-1.5 w-1.5 rounded-full",
              status === "streaming"
                ? "bg-accent-amber"
                : status === "error"
                  ? "bg-accent-amber"
                  : "bg-accent-emerald",
            )}
          />
          <span>{t("modelLabel")}</span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <span>{t("enterHintBefore")}</span>
          <kbd className="rounded border border-border bg-foreground/[0.05] px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-[inset_0_1px_0_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/55 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
            {t("enterKey")}
          </kbd>
          <span>{t("enterHintAfter")}</span>
        </div>
      </div>
    </form>
  );
}

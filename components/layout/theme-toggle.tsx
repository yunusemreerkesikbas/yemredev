"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("header.theme");
  const { setTheme, resolvedTheme } = useTheme();

  const handleClick = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      aria-label={t("label")}
      onClick={handleClick}
      suppressHydrationWarning
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-foreground/15 dark:bg-foreground/[0.06] dark:hover:bg-foreground/10 dark:shadow-none",
        className,
      )}
    >
      <Sun
        aria-hidden
        className="block h-[1.125rem] w-[1.125rem] text-foreground dark:hidden"
        strokeWidth={2}
      />
      <Moon
        aria-hidden
        className="hidden h-[1.125rem] w-[1.125rem] text-foreground dark:block"
        strokeWidth={2}
      />
    </button>
  );
}

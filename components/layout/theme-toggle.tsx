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
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-foreground/10 bg-background text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
        className,
      )}
    >
      <Sun aria-hidden className="block h-4 w-4 dark:hidden" />
      <Moon aria-hidden className="hidden h-4 w-4 dark:block" />
    </button>
  );
}

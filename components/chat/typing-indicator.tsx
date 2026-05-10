"use client";

import { useTranslations } from "next-intl";

export function TypingIndicator() {
  const t = useTranslations("chat");

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground"
    >
      <span className="sr-only">{t("typing")}</span>
      <span className="animate-chat-dot-bounce inline-block h-2 w-2 rounded-full bg-white/60 [animation-delay:0ms]" />
      <span className="animate-chat-dot-bounce inline-block h-2 w-2 rounded-full bg-white/60 [animation-delay:150ms]" />
      <span className="animate-chat-dot-bounce inline-block h-2 w-2 rounded-full bg-white/60 [animation-delay:300ms]" />
    </div>
  );
}

"use client";

import type { UIMessage } from "ai";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: UIMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations("chat");
  const isUser = message.role === "user";

  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

  if (!text) return null;

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] min-w-0 rounded-xl px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "border border-primary/25 bg-primary/15 text-foreground dark:text-white"
            : "border border-border bg-foreground/[0.04] text-foreground/90 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/90",
        )}
      >
        <span className="sr-only">
          {isUser ? t("userRoleLabel") : t("assistantRoleLabel")}:{" "}
        </span>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

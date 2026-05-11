"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { useTranslations } from "next-intl";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import type { ChatErrorCode } from "@/lib/ai/errors";

type MessageListProps = {
  messages: UIMessage[];
  isStreaming: boolean;
  errorCode: ChatErrorCode | null;
  onRetry: () => void;
};

export function MessageList({
  messages,
  isStreaming,
  errorCode,
  onRetry,
}: MessageListProps) {
  const t = useTranslations("chat");
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageContent =
    messages[messages.length - 1]?.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("") ?? "";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, lastMessageContent, isStreaming]);

  return (
    <div
      role="log"
      aria-label={t("ariaListLabel")}
      aria-live="polite"
      className="flex w-full flex-col gap-2 rounded-xl border border-border bg-foreground/[0.03] px-2 py-3 sm:px-3 dark:border-white/5 dark:bg-black/20 lg:flex-1 lg:min-h-0 lg:overflow-y-auto"
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isStreaming &&
        messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex w-full justify-start">
            <TypingIndicator />
          </div>
        )}

      {errorCode && (
        <div className="flex w-full flex-col items-start gap-2 rounded-xl border border-accent-amber/30 bg-accent-amber/[0.06] px-4 py-3">
          <p className="text-sm text-accent-amber">
            {t(`errors.${errorCode}`)}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-border bg-foreground/[0.05] px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/30 hover:bg-foreground/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/80 dark:hover:border-white/25 dark:hover:bg-white/[0.08] dark:hover:text-white"
          >
            {t("retryLabel")}
          </button>
        </div>
      )}

      <div ref={bottomRef} aria-hidden />
    </div>
  );
}

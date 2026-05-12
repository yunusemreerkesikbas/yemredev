"use client";

import { useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import {
  ChatInputBar,
  type ChatInputStatus,
} from "@/components/landing/chat-input-bar";
import {
  QuickActionChips,
  type ChipKey,
} from "@/components/landing/quick-action-chips";
import { LandingHero } from "@/components/landing/landing-hero";
import { cn } from "@/lib/utils";
import type { AppLocale } from "@/i18n/routing";
import type { ChatErrorCode } from "@/lib/ai/errors";
import { MessageList } from "./message-list";

const ERROR_CODES: ReadonlySet<ChatErrorCode> = new Set<ChatErrorCode>([
  "rate_limited",
  "provider_unavailable",
  "bad_request",
  "server_error",
  "generic",
]);

function isChatErrorCode(value: string): value is ChatErrorCode {
  return ERROR_CODES.has(value as ChatErrorCode);
}

function parseErrorCode(error: Error | undefined): ChatErrorCode | null {
  if (!error) return null;
  // The route returns `{ error: "<code>" }` for non-streaming errors. The AI
  // SDK forwards the response body as the Error message in many cases.
  const message = error.message ?? "";
  try {
    const parsed = JSON.parse(message) as { error?: string };
    if (parsed.error && isChatErrorCode(parsed.error)) return parsed.error;
  } catch {
    // Not JSON, fall through to substring match.
  }
  for (const code of ERROR_CODES) {
    if (message.includes(code)) return code;
  }
  return "generic";
}

type ChatIslandProps = {
  locale: AppLocale;
  prompts: Record<ChipKey, string>;
};

export function ChatIsland({ locale, prompts }: ChatIslandProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, regenerate } = useChat();

  const isBusy = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  const inputStatus: ChatInputStatus = useMemo(() => {
    if (status === "submitted") return "submitted";
    if (status === "streaming") return "streaming";
    if (status === "error") return "error";
    return "idle";
  }, [status]);

  const errorCode = useMemo(() => parseErrorCode(error), [error]);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed }, { body: { locale } });
    setInput("");
  }

  function handleChipClick(prompt: string) {
    if (isBusy) return;
    sendMessage({ text: prompt }, { body: { locale } });
  }

  function handleRetry() {
    regenerate({ body: { locale } });
  }

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-center",
        hasMessages
          ? "gap-4 py-4 max-lg:h-[calc(100dvh-5.5rem)] max-lg:min-h-0 max-lg:overflow-hidden lg:h-auto lg:min-h-0 lg:flex-1"
          : "min-h-[calc(100dvh-5.5rem)] justify-center gap-6 py-10 lg:h-full lg:min-h-0",
      )}
    >
      <div
        className={cn(
          "grid w-full transition-all duration-500 ease-in-out",
          hasMessages
            ? "pointer-events-none grid-rows-[0fr] opacity-0"
            : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="overflow-hidden">
          <LandingHero />
        </div>
      </div>

      {hasMessages && (
        <MessageList
          messages={messages}
          isStreaming={isBusy}
          errorCode={errorCode}
          onRetry={handleRetry}
        />
      )}

      {!hasMessages ? (
        <QuickActionChips
          prompts={prompts}
          onChipClick={handleChipClick}
          disabled={isBusy}
        />
      ) : null}

      <div className="relative z-20 w-full max-lg:pb-[max(0.5rem,env(safe-area-inset-bottom))] shrink-0">
        <ChatInputBar
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          status={inputStatus}
        />
      </div>
    </div>
  );
}

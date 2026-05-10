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
        "flex w-full flex-col items-center",
        hasMessages ? "flex-1 min-h-0 gap-4 py-4" : "h-full justify-center gap-6 py-10",
      )}
    >
      <div
        className={cn(
          "grid w-full transition-all duration-500 ease-in-out",
          hasMessages ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
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

      <QuickActionChips
        prompts={prompts}
        onChipClick={handleChipClick}
        disabled={isBusy}
        hidden={hasMessages}
      />

      <ChatInputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        status={inputStatus}
      />
    </div>
  );
}

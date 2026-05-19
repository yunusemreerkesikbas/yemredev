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
import { trackEvent } from "@/lib/analytics";
import type { AppLocale } from "@/i18n/routing";
import type { ChatErrorCode } from "@/lib/ai/errors";
import { MessageList } from "./message-list";

const CV_PDF_HREF = "/yunus_emre_erkesikbas_cv.pdf";
const CV_PDF_FILENAME = "yunus_emre_erkesikbas_cv.pdf";

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
    trackEvent("chat_message_sent", { locale });
    sendMessage({ text: trimmed }, { body: { locale } });
    setInput("");
  }

  function handleChipClick(key: ChipKey, prompt: string) {
    if (isBusy) return;
    if (key === "resume") {
      const link = document.createElement("a");
      link.href = CV_PDF_HREF;
      link.download = CV_PDF_FILENAME;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }
    trackEvent("chat_message_sent", { locale, source: "chip" });
    sendMessage({ text: prompt }, { body: { locale } });
  }

  function handleRetry() {
    regenerate({ body: { locale } });
  }

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-center max-lg:pb-0",
        hasMessages
          ? "min-h-0 max-h-full flex-1 gap-4 overflow-hidden pt-4 lg:min-h-0 lg:flex-1 lg:py-4"
          : "w-full shrink-0 gap-4 pt-4 lg:min-h-0 lg:flex-1 lg:justify-center lg:py-4",
      )}
    >
      {!hasMessages ? (
        <div className="flex w-full flex-col lg:min-h-0 lg:flex-1">
          <div
            className={cn(
              "flex w-full flex-col items-center gap-4 max-lg:flex-none",
              "lg:min-h-0 lg:flex-1 lg:justify-center lg:gap-6",
            )}
          >
            <div
              className={cn(
                "grid w-full transition-all duration-500 ease-in-out",
                "grid-rows-[1fr] opacity-100",
              )}
            >
              <div className="overflow-hidden">
                <LandingHero />
              </div>
            </div>
            <QuickActionChips
              prompts={prompts}
              onChipClick={handleChipClick}
              disabled={isBusy}
            />
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "grid w-full transition-all duration-500 ease-in-out",
              "pointer-events-none grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <LandingHero />
            </div>
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            <MessageList
              messages={messages}
              isStreaming={isBusy}
              errorCode={errorCode}
              onRetry={handleRetry}
            />
          </div>
        </>
      )}

      <div className="relative z-50 w-full max-lg:pb-[max(0.5rem,env(safe-area-inset-bottom))] shrink-0">
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

"use client";

import type { UIMessage } from "ai";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: UIMessage;
};

const assistantMarkdownClass =
  "min-w-0 break-words [&_a]:break-words [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-foreground/[0.1] [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:bg-white/[0.08] [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-bold [&_h1]:first:mt-0 [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:first:mt-0 [&_h3]:mb-2 [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:first:mt-0 [&_hr]:my-3 [&_hr]:border-border [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 [&_p]:last:mb-0 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-foreground/[0.06] [&_pre]:p-2 [&_pre]:font-mono [&_pre]:text-xs dark:[&_pre]:bg-white/[0.05] [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4";

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
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className={assistantMarkdownClass}>
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

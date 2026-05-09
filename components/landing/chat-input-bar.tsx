import { useTranslations } from "next-intl";
import { ArrowUp, Mic, Sparkles } from "lucide-react";

/**
 * Static, decorative chat input. Renders as a real <form> with a real
 * <input> for accessibility and visual fidelity, but everything is
 * inert in Phase 2:
 *  - input is readOnly + tabIndex=-1
 *  - mic + send buttons have type="button" and tabIndex=-1
 *  - form submit is prevented via preventDefault on the server-side
 *    rendered element (no client handler attached; default behaviour
 *    of a form without action is a same-page reload, which is suppressed
 *    by `onSubmit` style handler being absent and the submit button
 *    being inert). For belt-and-braces we omit the submit button type.
 *
 * Phase 6 will: drop readOnly, attach onSubmit -> POST /api/chat, swap
 * tabIndex back to default, and add a client wrapper for state.
 */
export function ChatInputBar() {
  const t = useTranslations("landing.input");

  return (
    <div className="group/search relative w-full">
      <div
        aria-hidden
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent-emerald/20 opacity-0 blur transition-opacity duration-300 group-focus-within/search:opacity-100"
      />

      <div className="relative flex w-full items-center rounded-xl border border-white/10 bg-card-dark p-1 transition-all duration-300 group-focus-within/search:border-primary/45 group-focus-within/search:shadow-[0_0_40px_-10px_rgba(59,184,247,0.3)]">
        <div className="flex items-center justify-center pl-4 pr-3 text-white/40 transition-colors duration-300 group-focus-within/search:text-primary">
          <Sparkles aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <input
          type="text"
          name="prompt"
          readOnly
          tabIndex={-1}
          autoComplete="off"
          inputMode="text"
          spellCheck={false}
          placeholder={t("placeholder")}
          aria-label={t("ariaLabel")}
          aria-readonly
          className="caret-primary w-full cursor-default border-none bg-transparent py-4 text-base font-medium tracking-tight text-white placeholder-white/30 focus:outline-none focus:ring-0 sm:text-lg"
        />

        <div className="flex items-center gap-2 pr-2">
          <button
            type="button"
            tabIndex={-1}
            aria-label={t("micLabel")}
            disabled
            className="rounded-lg bg-white/5 p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed"
          >
            <Mic aria-hidden className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label={t("sendLabel")}
            disabled
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            <ArrowUp aria-hidden className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="font-tabular mt-4 flex items-center justify-between px-2 font-mono text-xs uppercase tracking-wider text-white/25">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="animate-pulse-slow h-1.5 w-1.5 rounded-full bg-accent-emerald"
          />
          <span>{t("modelLabel")}</span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <span>{t("enterHintBefore")}</span>
          <kbd className="rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/55 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
            {t("enterKey")}
          </kbd>
          <span>{t("enterHintAfter")}</span>
        </div>
      </div>
    </div>
  );
}

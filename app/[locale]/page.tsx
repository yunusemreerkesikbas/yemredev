import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <Link
        href="/home"
        className="absolute right-4 top-4 inline-flex h-9 items-center gap-2 rounded-md border border-foreground/15 bg-background/60 px-3 text-xs font-medium text-foreground/80 backdrop-blur transition-colors hover:bg-foreground/5 sm:right-6 sm:top-6"
      >
        {t("skip")}
        <span aria-hidden>→</span>
      </Link>

      <div className="flex max-w-2xl flex-col items-center gap-4">
        <span className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground/60">
          {t("comingSoon")}
        </span>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-pretty text-base leading-relaxed text-foreground/70 sm:text-lg">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-10 w-full max-w-xl opacity-60">
        <div
          aria-hidden
          className="flex h-12 w-full items-center rounded-full border border-foreground/10 bg-background/60 px-4 text-sm text-foreground/40"
        >
          {t("placeholder")}
        </div>
      </div>
    </section>
  );
}

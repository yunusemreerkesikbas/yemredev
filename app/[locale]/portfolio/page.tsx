import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground/60">
        {t("comingSoon")}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {t("title")}
      </h1>
    </section>
  );
}

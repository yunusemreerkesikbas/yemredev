import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">
        404
      </span>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t("error")}
      </h1>
      <Link
        href="/"
        className="mt-6 inline-flex h-9 items-center rounded-md border border-foreground/15 px-4 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/5"
      >
        {t("back")}
      </Link>
    </section>
  );
}

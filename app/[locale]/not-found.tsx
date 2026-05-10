import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden text-foreground">
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          404
        </span>
        <h1 className="text-gradient-fade mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("error")}
        </h1>
        <Link
          href="/"
          className="mt-6 inline-flex h-9 items-center rounded-lg border border-border bg-foreground/[0.05] px-4 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/[0.09] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {t("back")}
        </Link>
      </main>
    </div>
  );
}

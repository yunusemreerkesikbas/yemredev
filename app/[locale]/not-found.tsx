import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MeshBackground } from "@/components/layout/mesh-background";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background-dark text-white">
      <MeshBackground />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          404
        </span>
        <h1 className="text-gradient-fade mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("error")}
        </h1>
        <Link
          href="/"
          className="mt-6 inline-flex h-9 items-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {t("back")}
        </Link>
      </main>
    </div>
  );
}

import { useTranslations } from "next-intl";

export function LandingFooter() {
  const t = useTranslations("landing.footer");
  const year = new Date().getFullYear();

  return (
    <footer className="pointer-events-none relative z-10 flex w-full select-none items-end justify-between px-6 py-6 font-mono text-xs text-muted-foreground/40 md:px-10">
      <div className="flex flex-col gap-1">
        <span>{t("ready")}</span>
        <span>{t("latency")}</span>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <span>{t("version")}</span>
        <span>{t("copyright", { year })}</span>
      </div>
    </footer>
  );
}

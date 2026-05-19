"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getMeasurementId,
  getStoredConsent,
  setStoredConsent,
} from "@/lib/analytics";

export function ConsentBanner() {
  const t = useTranslations("analytics.banner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getStoredConsent() === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    setStoredConsent("granted");
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    const id = getMeasurementId();
    if (id) {
      window.gtag?.("config", id, {
        page_path: window.location.pathname + window.location.search,
      });
    }
    setVisible(false);
  }

  function handleDecline() {
    setStoredConsent("denied");
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{t("title")}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={handleDecline}
            className="inline-flex h-11 min-w-20 items-center justify-center rounded-lg border border-border bg-transparent px-4 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex h-11 min-w-20 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

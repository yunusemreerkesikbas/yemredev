"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getMeasurementId, hasAnalyticsConsent } from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Initialize GA on mount for returning visitors who already consented.
  useEffect(() => {
    const id = getMeasurementId();
    if (!id || !hasAnalyticsConsent()) return;
    window.gtag?.("config", id, {
      page_path: window.location.pathname + window.location.search,
    });
  }, []);

  // Track SPA navigations after the initial mount.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const id = getMeasurementId();
    if (!id || !hasAnalyticsConsent()) return;
    window.gtag?.("event", "page_view", {
      page_path: window.location.pathname + window.location.search,
    });
  }, [pathname]);

  return null;
}

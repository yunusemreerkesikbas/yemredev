"use client";

import { type ReactNode, useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Route changes swap instantly — no page-level motion. Landing ↔ app uses the
 * iris overlay only (`IrisTransitionProvider` + `IrisTransitionPortal`).
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain">
      {children}
    </div>
  );
}

"use client";

import { type ReactNode, useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type PageTransitionProps = {
  children: ReactNode;
};

function isLandingPath(pathname: string): boolean {
  const p = pathname === "" ? "/" : pathname;
  return p === "/";
}

/**
 * Route changes swap instantly — no page-level motion. Landing ↔ app uses the
 * iris overlay only (`IrisTransitionProvider` + `IrisTransitionPortal`).
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const landing = isLandingPath(pathname);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-x-hidden overscroll-y-contain",
        landing ? "overflow-hidden" : "overflow-y-auto",
      )}
    >
      {children}
    </div>
  );
}

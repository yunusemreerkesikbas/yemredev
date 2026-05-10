"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import type { Profile } from "@/types/profile";
import { AppHeader } from "@/components/layout/app-header";
import { LandingHeader } from "@/components/layout/landing-header";
import { MeshBackground } from "@/components/layout/mesh-background";
import { PageTransition } from "@/components/layout/page-transition";

function isLandingPath(pathname: string): boolean {
  const p = pathname === "" ? "/" : pathname;
  return p === "/";
}

type LocaleShellProps = {
  profile: Profile;
  children: ReactNode;
};

/**
 * Site chrome: header by route; mesh swaps with route (no motion); page body
 * has no enter/exit animation — only the landing iris is animated.
 */
export function LocaleShell({ profile, children }: LocaleShellProps) {
  const pathname = usePathname();
  const landing = isLandingPath(pathname);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <div className="shrink-0">
        {landing ? (
          <LandingHeader profile={profile} />
        ) : (
          <AppHeader profile={profile} />
        )}
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          {landing ? (
            <MeshBackground withCenterPulse withSparkles />
          ) : (
            <MeshBackground withCornerAccents />
          )}
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}

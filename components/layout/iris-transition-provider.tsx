"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  IrisTransitionPortal,
  type IrisTransitionVariant,
} from "@/components/layout/iris-transition-portal";

export type IrisNavTarget = "/home" | "/";

type IrisSession = {
  vw: number;
  vh: number;
  variant: IrisTransitionVariant;
  targetPath: IrisNavTarget;
};

const FALLBACK_CLEAR_MS = 12_000;

function pathnameMatchesTarget(
  pathname: string | null,
  targetPath: IrisNavTarget,
): boolean {
  if (pathname == null) return false;
  if (targetPath === "/") {
    return pathname === "/" || pathname === "";
  }
  return pathname === targetPath;
}

type IrisTransitionContextValue = {
  beginSkipToHome: () => void;
  beginFabToLanding: () => void;
  skipAriaBusy: boolean;
  fabAriaBusy: boolean;
};

const IrisTransitionContext = createContext<IrisTransitionContextValue | null>(
  null,
);

/**
 * Keeps the iris overlay mounted across landing ↔ home navigations so the SVG
 * animation and router.push sequencing are not torn down when the route segment unmounts.
 */
export function IrisTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const maskBaseId = useId().replace(/:/g, "");
  const maskId = `iris-${maskBaseId}-chrome`;

  const [session, setSession] = useState<IrisSession | null>(null);
  const [irisDone, setIrisDone] = useState(false);
  const hasPushedRef = useRef(false);

  const clearSession = useCallback(() => {
    setSession(null);
    setIrisDone(false);
    hasPushedRef.current = false;
  }, []);

  const completeIris = useCallback(() => {
    if (!session || hasPushedRef.current) return;
    hasPushedRef.current = true;
    if (session.targetPath === "/home") {
      router.push("/home");
    } else {
      router.push("/");
    }
    setIrisDone(true);
  }, [router, session]);

  const beginSkipToHome = useCallback(() => {
    hasPushedRef.current = false;
    setIrisDone(false);
    setSession({
      vw: window.innerWidth,
      vh: window.innerHeight,
      variant: "toFab",
      targetPath: "/home",
    });
  }, []);

  const beginFabToLanding = useCallback(() => {
    hasPushedRef.current = false;
    setIrisDone(false);
    setSession({
      vw: window.innerWidth,
      vh: window.innerHeight,
      variant: "toLanding",
      targetPath: "/",
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    const fallback = window.setTimeout(() => {
      clearSession();
    }, FALLBACK_CLEAR_MS);
    return () => window.clearTimeout(fallback);
  }, [session, clearSession]);

  useEffect(() => {
    if (!session || !irisDone) return;
    if (!pathnameMatchesTarget(pathname, session.targetPath)) return;
    queueMicrotask(clearSession);
  }, [session, irisDone, pathname, clearSession]);

  const value = useMemo(
    () => ({
      beginSkipToHome,
      beginFabToLanding,
      skipAriaBusy: session?.targetPath === "/home",
      fabAriaBusy: session?.targetPath === "/",
    }),
    [beginSkipToHome, beginFabToLanding, session],
  );

  return (
    <IrisTransitionContext.Provider value={value}>
      {children}
      {session !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <IrisTransitionPortal
            vw={session.vw}
            vh={session.vh}
            maskId={maskId}
            variant={session.variant}
            onComplete={completeIris}
          />,
          document.body,
        )}
    </IrisTransitionContext.Provider>
  );
}

export function useIrisTransition(): IrisTransitionContextValue {
  const ctx = useContext(IrisTransitionContext);
  if (!ctx) {
    throw new Error(
      "useIrisTransition must be used within IrisTransitionProvider",
    );
  }
  return ctx;
}

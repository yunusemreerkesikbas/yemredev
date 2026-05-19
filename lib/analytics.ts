/** localStorage key for analytics cookie preference (KVKK/GDPR). */
export const CONSENT_STORAGE_KEY = "yemredev-cookie-consent";

export type ConsentStatus = "granted" | "denied";

const PLACEHOLDER_MEASUREMENT_ID = "G-XXXXXXXXXX";

export function getMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id || id === PLACEHOLDER_MEASUREMENT_ID) return undefined;
  return id;
}

export function getStoredConsent(): ConsentStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

export function setStoredConsent(status: ConsentStatus): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    /* ignore */
  }
}

export function hasAnalyticsConsent(): boolean {
  return getStoredConsent() === "granted";
}

export type GtagCommand = "config" | "consent" | "js" | "event" | "set";

export type GtagFn = (
  command: GtagCommand | string,
  targetOrAction: string | Date | Record<string, unknown>,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

export function getPagePath(pathname: string, search?: string): string {
  if (!search) return pathname;
  return `${pathname}?${search}`;
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

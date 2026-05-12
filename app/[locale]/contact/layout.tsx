import type { ReactNode } from "react";

/**
 * Route shell for `/contact` only — flex/overflow live here so `/projects`
 * page edits cannot accidentally change this wrapper.
 */
export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-route="contact"
      className="contact-route-root relative flex w-full max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:shrink-0 flex-col overflow-x-hidden text-foreground selection:bg-primary/30 lg:flex-1 lg:min-h-0 lg:overflow-hidden"
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

/**
 * Route shell for `/projects` only — flex/overflow live here so `/contact`
 * layout stays independent.
 */
export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-route="projects"
      className="projects-route-root relative flex w-full max-lg:shrink-0 flex-col overflow-x-hidden text-foreground selection:bg-primary/30 lg:flex-1 lg:min-h-0 lg:overflow-hidden"
    >
      {children}
    </div>
  );
}

/**
 * Open-source contribution highlight. One of these renders in the home
 * bento `OpenSourceHighlight` card. List lives on `Profile.openSource`.
 *
 * Numbers are static (Phase 3 ships placeholders); a future pass may swap
 * to a runtime GitHub fetch with ISR.
 */
export type OpenSourceProject = {
  name: string;
  description: string;
  /** Repo URL (https://github.com/...). */
  repo: string;
  stars: number;
  forks: number;
  /** Primary language label, e.g. "TypeScript", "Rust". */
  language: string;
  /**
   * Accent token to colour the corner blur orb. Maps to one of the
   * existing accent tokens in app/globals.css.
   */
  primaryColor?: "primary" | "emerald" | "purple" | "amber";
};

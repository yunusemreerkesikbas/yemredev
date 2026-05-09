export type ProjectLink = {
  label: string;
  url: string;
  type: "live" | "repo" | "case-study" | "demo";
};

/**
 * Project lifecycle status. Drives the small status badge in the home
 * bento featured card and (eventually) the Phase 4 carousel filters.
 */
export type ProjectStatus = "live" | "wip" | "archived";

/**
 * Project category. Used by the home bento `FeaturedProject` card to colour
 * the accent orb and by the Phase 4 carousel to group projects.
 */
export type ProjectCategory = "saas" | "tool" | "open-source" | "client";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  year: number;
  role: string;
  client?: string;
  stack: string[];
  cover?: string;
  gallery?: string[];
  links: ProjectLink[];
  featured: boolean;
  /** Optional long-form case study body shown full-width below the main grid. */
  detail?: string;
  /** Optional lifecycle hint. Defaults to "live" when omitted. */
  status?: ProjectStatus;
  /** Optional grouping. Defaults to "client" when omitted. */
  category?: ProjectCategory;
};

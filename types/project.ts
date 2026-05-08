export type ProjectLink = {
  label: string;
  url: string;
  type: "live" | "repo" | "case-study" | "demo";
};

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
};

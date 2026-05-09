import type { OpenSourceProject } from "./open-source";

export type SocialLink = {
  platform: "github" | "linkedin" | "twitter" | "email" | "website";
  label: string;
  url: string;
};

export type Education = {
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string | "present";
  location?: string;
  description?: string;
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string | "present";
  location?: string;
  highlights: string[];
  stack?: string[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

/**
 * Optional availability flag shown by the home bento `StatusBlock` card.
 * When omitted, the card hides the availability dot+text combo.
 */
export type Availability = {
  available: boolean;
  /** Localised label, e.g. "Available for new projects" / "Yeni projelere açığım". */
  label: string;
};

export type Profile = {
  name: string;
  initials: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  avatar?: string;
  /** Optional availability shown in the home StatusBlock card. */
  availability?: Availability;
  social: SocialLink[];
  education: Education[];
  experience: Experience[];
  skills: SkillGroup[];
  /** Optional OSS contributions surfaced by the home OpenSourceHighlight card. */
  openSource?: OpenSourceProject[];
};

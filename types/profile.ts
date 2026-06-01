export type SocialLink = {
  platform: "github" | "linkedin" | "twitter" | "email" | "whatsapp" | "website";
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

/**
 * Optional public-safe personal blurbs for the AI assistant only (not shown
 * as landing chips). Empty strings are omitted from the system prompt.
 */
export type ProfilePersonal = {
  languages?: string;
  hobbies?: string;
  currentlyLearning?: string;
  community?: string;
  workValues?: string;
  /** How you describe temperament & character for the assistant (keep public-safe). */
  personality?: string;
  /** Vendor exams, cloud, Scrum, etc. — omit or empty until you publish specifics. */
  certifications?: string;
  /** Freelance / collaboration scope, remote preference, time-zone hints. */
  freelancePreferences?: string;
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
  /** Optional lifestyle / soft facts for the chat assistant (no UI chips). */
  personal?: ProfilePersonal;
};

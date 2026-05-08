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

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  avatar?: string;
  social: SocialLink[];
  education: Education[];
  experience: Experience[];
  skills: SkillGroup[];
};

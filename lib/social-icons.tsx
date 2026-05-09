import type { ComponentType, SVGProps } from "react";
import { Globe, Mail } from "lucide-react";
import type { SocialLink } from "@/types/profile";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/icons/brand-icons";

type SocialIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Shared map: profile social `platform` → icon component (home + contact). */
export const SOCIAL_PLATFORM_ICON: Record<
  SocialLink["platform"],
  SocialIconComponent
> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  email: Mail,
  website: Globe,
};

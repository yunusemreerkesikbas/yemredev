import { getTranslations } from "next-intl/server";
import type { Profile, SocialLink } from "@/types/profile";
import { SOCIAL_PLATFORM_ICON } from "@/lib/social-icons";

type ContactSocialPanelProps = {
  profile: Profile;
  /**
   * `besideContact` — satır içi: üst çizgi yok, etiket + ikonlar e-posta/konum bloğunun yanına uyumlu.
   */
  layout?: "standalone" | "besideContact";
};

/**
 * Social destinations as a plain icon strip (no card grid). Icons from
 * [`lib/social-icons`](../../lib/social-icons.tsx).
 */
export async function ContactSocialPanel({
  profile,
  layout = "standalone",
}: ContactSocialPanelProps) {
  const t = await getTranslations("contact");
  const beside = layout === "besideContact";

  return (
    <section
      aria-labelledby="contact-social-heading"
      className={
        beside
          ? "flex flex-col items-center gap-4 text-center md:min-w-0"
          : "border-t border-white/[0.08] pt-10 text-center lg:pt-14"
      }
    >
      <h2
        id="contact-social-heading"
        className={
          beside
            ? "w-full text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
            : "mx-auto max-w-md text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
        }
      >
        {t("socialPanelTitle")}
      </h2>
      <ul
        className={`flex list-none flex-wrap items-center gap-2 p-0 sm:gap-3 ${beside ? "justify-center" : "mt-5 justify-center"}`}
      >
        {profile.social.map((social, index) => (
          <li key={`${social.platform}-${index}`}>
            <SocialIconLink
              social={social}
              description={t(`channelDescriptions.${social.platform}`)}
              newTabHint={t("opensInNewTab")}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

type SocialIconLinkProps = {
  social: SocialLink;
  description: string;
  newTabHint: string;
};

function SocialIconLink({ social, description, newTabHint }: SocialIconLinkProps) {
  const Icon = SOCIAL_PLATFORM_ICON[social.platform];
  const isEmail = social.platform === "email";
  const title = isEmail ? description : `${description} (${newTabHint})`;

  return (
    <a
      href={social.url}
      title={title}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noopener noreferrer"}
      aria-label={social.label}
      className="inline-flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon aria-hidden className="h-[22px] w-[22px]" strokeWidth={1.6} />
    </a>
  );
}

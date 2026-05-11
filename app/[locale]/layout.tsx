import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { canonicalUrl, hreflangAlternates, OG_IMAGE_URL } from "@/lib/seo";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { IrisTransitionProvider } from "@/components/layout/iris-transition-provider";
import { LocaleShell } from "@/components/layout/locale-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getProfile } from "@/lib/data";
import { routing, type AppLocale } from "@/i18n/routing";

// Display + body sans. Variable font, supports stylistic alternates (ss01-ss05).
// Picked over Inter for distinctive geometric character ("AI console" voice).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Telemetry / kbd / footer mono. Engineer-canonical, paired with Space Grotesk.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = canonicalUrl(locale, "");
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://yemredev.com"
    ),
    title: {
      default: t("title"),
      template: "%s | Yunus Emre Erkesikbaş",
    },
    description: t("description"),
    alternates: {
      canonical,
      languages: hreflangAlternates(""),
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [
        { url: OG_IMAGE_URL, width: 1200, height: 630, alt: t("title") },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: t("twitterHandle"),
      title: t("title"),
      description: t("description"),
      images: [OG_IMAGE_URL],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const profile = getProfile(locale as AppLocale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-dvh bg-background text-foreground"
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <IrisTransitionProvider>
              <LocaleShell profile={profile}>{children}</LocaleShell>
            </IrisTransitionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { inter, dancingScript, notoSansKhmer, bokor } from "@/lib/font";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { Bounce, ToastContainer } from "react-toastify";

import ReactQueryProvider from "@/providers/reactQueryProvider";

import type { Props } from "@/types/rootLayout";
import MaybeNav from "@/components/nav/ConditionalNav";
import ConditionalFooter from "@/components/footer/ConditionalFooter";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    keywords: [
      "link in bio",
      "social media",
      "profile",
      "cambodia",
      "khnhom",
      "links",
    ],
    authors: [{ name: "Khnhom" }],
    creator: "Khnhom",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        kh: `${baseUrl}/kh`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: "Khnhom",
      locale: locale === "kh" ? "km_KH" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add your verification codes when ready
      // google: 'your-google-site-verification',
      // yandex: 'your-yandex-verification',
      // bing: 'your-bing-verification',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "kh" }];
}

export default async function RootLayout({ children, params }: Props) {
  // actually break if we remove this await
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${dancingScript.variable} ${notoSansKhmer.variable} ${bokor.variable} antialiased`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProvider>
            <div className="flex flex-col min-h-screen">
              <MaybeNav locale={locale} />
              {/* <SmoothScrollProvider>{children}</SmoothScrollProvider> */}
              <main className="grow">{children}</main>
              <ConditionalFooter locale={locale} />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={10000}
              pauseOnHover={true}
              draggable={true}
              theme={"colored"}
              transition={Bounce}
            />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

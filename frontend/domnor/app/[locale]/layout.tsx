import type { Metadata } from "next";
import { inter, dancingScript, notoSansKhmer, bokor } from "@/lib/font";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import ReactQueryProvider from "@/providers/reactQueryProvider";

import type { Props } from "@/types/rootLayout/rootLayout";

export const metadata: Metadata = {
  title: "Domnor",
  description:
    "A home for all your social media links. Made especially for Cambodians.",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "kh" }];
}

export default async function RootLayout({ children, params }: Props) {
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
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

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

  return {
    title: t("title"),
    description: t("description"),
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

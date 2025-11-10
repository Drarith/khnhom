import type { Metadata } from "next";
import { inter, dancingScript } from "@/lib/font";
import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";

export const metadata: Metadata = {
  title: "Domnor",
  description:
    "A home for all your social media links. Made especially for Cambodians.",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "kh" }];
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.variable} ${dancingScript.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

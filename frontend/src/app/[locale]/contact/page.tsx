import { Mail, Send } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contactPage");

  return (
    <div className="min-h-screen w-full  text-foreground/90 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-12 py-24">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-lg  max-w-lg mx-auto">{t("description")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Email Card */}
          <Link
            href="mailto:sarindararith@gmail.com"
            className="group p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              {t("email.title")}
            </h3>
            <p className=" text-sm mb-4">{t("email.description")}</p>
            <div className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors">
              khnhomofficial@gmail.com
            </div>
          </Link>

          {/* Telegram Card */}
          <Link
            href="https://t.me/drarith"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 text-sky-400 group-hover:scale-110 transition-transform">
              <Send size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              {t("telegram.title")}
            </h3>
            <p className=" text-sm mb-4">{t("telegram.description")}</p>
            <div className="text-sm font-medium text-foreground group-hover:text-sky-400 transition-colors">
              @drarith
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

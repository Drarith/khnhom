import Image from "next/image";
import {
  ShieldCheck,
  Globe,
  QrCode,
  Heart,
  Sparkles,
  Code,
} from "lucide-react";
import ClientAbout from "@/providers/AboutMeClient";
import { LanguageToggle } from "@/components/ui/languageSwitchpill";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("aboutPage");

  return (
    <ClientAbout>
      <div className="min-h-screen w-full">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          {/* Hero Section */}
          <section className="flex flex-col items-center text-center mb-32 space-y-8">
            <div className="line inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-secondary/50 text-sm font-medium text-foreground/80">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="line text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              {t("hero.titleLine1")} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-foreground to-secondary">
                {t("hero.titleLine2")}
              </span>
            </h1>

            <p className="line text-lg md:text-xl text-foreground/90 max-w-2xl leading-relaxed">
              {t("hero.description")}
            </p>
          </section>

          {/* Bento Grid Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            {/* Large Card - Localization */}
            <div className="line md:col-span-2 p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-col items-center gap-8">
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                  <Globe size={24} color="white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {t("features.localized.title")}
                </h3>
                <p className="text-foreground/90 leading-relaxed">
                  {t("features.localized.description")}
                </p>
              </div>

              <LanguageToggle />
            </div>

            {/* Tall Card - Payments */}
            <div className="line md:row-span-2 p-8 rounded-3xl bg-secondary text-foreground shadow-xl">
              <div className="h-full flex flex-col">
                <div className="w-12 h-12 bg-foreground/10 rounded-2xl flex items-center justify-center mb-6">
                  <QrCode size={24} className="text-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  {t("features.khqr.title")}
                </h3>
                <p className="opacity-80 leading-relaxed mb-8">
                  {t("features.khqr.description")}
                </p>
                <div className="mt-auto relative w-full aspect-square bg-foreground/5 rounded-2xl flex items-center justify-center border border-foreground/10">
                  <QrCode size={64} className="opacity-20" />
                </div>
              </div>
            </div>

            {/* Card - Privacy First */}
            <div className="line p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                <ShieldCheck size={24} color="white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {t("features.privacy.title")}
                </h3>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {t("features.privacy.description")}
                </p>
              </div>
            </div>

            {/* Card - Creator Focused */}
            <div className="line p-8 rounded-3xl bg-secondary/10 border border-secondary/20 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 text-pink-400">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {t("features.creator.title")}
                </h3>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {t("features.creator.description")}
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="line relative aspect-4/5 md:aspect-square rounded-3xl overflow-hidden bg-secondary/20">
              <Image
                src="https://res.cloudinary.com/dosj9q3zb/image/upload/v1766906599/photo_2025-09-14_12-48-24_nigh7z.jpg"
                alt="Sarin Dararith"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="space-y-8">
              <div className="line inline-flex items-center gap-2 text-accent font-medium tracking-wide uppercase text-sm">
                <Code size={16} />
                <span>{t("story.badge")}</span>
              </div>

              <h2 className="line text-3xl md:text-4xl font-bold text-foreground">
                {t("story.title")}
              </h2>

              <div className="line space-y-6 text-foreground/90 leading-relaxed text-lg">
                <p>{t("story.p1")}</p>
                <p>{t("story.p2")}</p>
                <p>{t("story.p3")}</p>
              </div>

              <div className="line pt-4">
                <div className="text-foreground font-semibold text-xl">
                  {t("story.founderName")}
                </div>
                <div className="text-foreground">{t("story.founderRole")}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ClientAbout>
  );
}

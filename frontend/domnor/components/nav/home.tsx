'use client';
import { useTranslations } from "use-intl";

export default function Home() {
  const t = useTranslations("homepage");
  return (
    <div>
      <h1 className=" text-4xl font-cursive">{t("title")}</h1>
    </div>
  );
}

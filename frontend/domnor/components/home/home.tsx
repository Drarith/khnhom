import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("homepage");
  return (
    <div>
      <h1 className=" text-4xl font-cursive">{t("title")}</h1>
    </div>
  );
}

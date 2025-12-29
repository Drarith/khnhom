import { getTranslations } from "next-intl/server";
import GoogleLogin from "../googleLogin/googleLogin";

export default async function Home() {
  const t = await getTranslations("homepage");
  return (
    <div className="flex flex-col justify-center text-center min-h-screen">
      <section>
        <h1 className=" text-7xl font-cursive">{t("title")}</h1>
        <h2 className=" text-4xl font-cursive">{t("slogan")}</h2>
        <div>
          <GoogleLogin />
        </div>
      </section>
    </div>
  );
}

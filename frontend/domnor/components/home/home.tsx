import { getTranslations } from "next-intl/server";
import GoogleLogin from "../googleLogin/googleLogin";
import HeadSection from "./HeadSection";

export default async function Home() {
  const t = await getTranslations("homepage");
  return (
    <div className="flex flex-col justify-center text-center mt-30">
      <HeadSection />
    </div>
  );
}

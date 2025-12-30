import { getTranslations } from "next-intl/server";
import GoogleLogin from "../googleLogin/googleLogin";
import HeadSection from "./HeadSection";
import VerticalCarousel from "./VerticalCarousel"

export default async function Home() {
  const t = await getTranslations("homepage");

  return (
    <div className="flex flex-col text-start mt-25 ">
      <HeadSection />
      <VerticalCarousel/>
 
    </div>
  );
}

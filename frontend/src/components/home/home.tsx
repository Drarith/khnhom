import { getTranslations } from "next-intl/server";
import GoogleLogin from "../googleLogin/googleLogin";
import HeadSection from "./HeadSection";
import VerticalCarousel from "./VerticalCarousel";

export default async function Home() {
  const t = await getTranslations("homepage");

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mt-16 md:mt-24 px-4 md:px-8 gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col w-full lg:w-1/2 mt-11">
        <HeadSection />
        <div className="flex justify-center lg:justify-start my-8 md:my-12 animate-fade-in-up lg:pl-12">
          <GoogleLogin />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <VerticalCarousel />
      </div>
    </div>
  );
}

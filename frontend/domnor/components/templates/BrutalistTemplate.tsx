import { ProfileData } from "@/types/profileData";
import { themes } from "@/config/theme";
import Image from "next/image";
import { Share2, ExternalLink, Terminal, ArrowRight } from "lucide-react";

import TemplateShare from "./TemplateShare";

import {
  SiTiktok,
  SiX,
  SiTelegram,
  SiInstagram,
  SiYoutube,
  SiGithub,
  SiFacebook,
} from "@icons-pack/react-simple-icons";
import Footer from "../userProfile/Footer";
import { backgroundImages } from "@/config/background";

type SocialPlatform =
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "telegram"
  | "youtube"
  | "github";

export default function BrutalistTemplate({ data }: { data: ProfileData }) {
  const activeTheme = themes.find((theme) => {
    return theme.name === data.theme;
  });

  const icons: Record<SocialPlatform, React.ReactElement> = {
    facebook: <SiFacebook className="w-6 h-6" />,
    x: <SiX className="w-6 h-6" />,
    instagram: <SiInstagram className="w-6 h-6" />,
    tiktok: <SiTiktok className="w-6 h-6" />,
    telegram: <SiTelegram className="w-6 h-6" />,
    youtube: <SiYoutube className="w-6 h-6" />,
    github: <SiGithub className="w-6 h-6" />,
  };

  const backgroundImage = backgroundImages.find(
    (bg) => bg.name === data.backgroundImage
  )?.url;

  const bgColor = activeTheme?.bg || "#ffffff";
  const textColor = activeTheme?.text || "#000000";
  //   const buttonColor = activeTheme?.button || "#000000";
  //   const buttonText = activeTheme?.buttonText || "#ffffff";

  return (
    <>
      <div
        className="w-full min-h-screen flex flex-col font-mono uppercase relative md:rounded-2xl md:overflow-hidden"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Background Image Layer */}
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage!}
              alt="background"
              fill
              className="object-cover opacity-20 contrast-125"
              priority
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          </div>
        )}

        <div className="relative z-10 flex flex-col min-h-screen md:border-x-4 border-black max-w-2xl  bg-white/50 backdrop-blur-sm">
          {/* Header Bar */}
          <div className="border-b-4 border-black p-3 md:p-4 flex justify-between items-center bg-black text-white">
            <div className="flex items-center gap-2">
              <Terminal size={20} />
              <span className="font-bold tracking-widest">
                USER_PROFILE.EXE
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-4 md:p-6 border-b-4 border-black grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src={data.profilePictureUrl}
                alt="profile picture"
                fill
                className="object-cover  transition-all duration-300"
                priority
              />
            </div>

            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tighter wrap-break-words">
                  {data.displayName}
                </h1>
                <div className="inline-block bg-black text-white px-2 py-1 mt-2 font-bold text-lg">
                  @{data.username}
                </div>
              </div>

              {data.bio && (
                <p className="text-sm md:text-base font-bold leading-tight border-l-4 border-black pl-4 py-1">
                  {data.bio}
                </p>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="flex-1 p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-2 mb-6 opacity-50">
              <ArrowRight size={20} />
              <span className="font-bold">AVAILABLE_LINKS</span>
            </div>

            {data.links &&
              data.links.map((link, index) => (
                <div key={link._id} className="relative group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-4 pr-14 lg:pr-4 border-4 border-black font-black text-lg md:text-xl transition-all duration-200 -translate-y-1 translate-x-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:translate-y-0 lg:translate-x-0 lg:shadow-none lg:hover:-translate-y-1 lg:hover:translate-x-1 lg:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none bg-white text-black flex justify-between items-center"
                  >
                    <span className="truncate mr-4">{link.title}</span>
                    <ExternalLink size={20} className="shrink-0" />
                  </a>
                  <TemplateShare
                    url={link.url}
                    title={link.title}
                    className="absolute right-2 top-1/2 -translate-y-1/2 lg:-right-3 lg:-top-3 lg:translate-y-0 lg:shadow-none lg:hover:-translate-y-1 lg:hover:translate-x-1 lg:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none bg-white text-black flex justify-between items-center"
                    ariaLabel="Share link"
                  >
                    <Share2 size={16} />
                  </TemplateShare>
                </div>
              ))}

            {/* Socials & Footer */}
            <div className="border-t-4 border-black">
              <div className="flex flex-wrap justify-center border-b-4 border-black gap-3 p-4">
                {Object.entries(data?.socials)
                  .filter(([_, v]) => v !== "")
                  .map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square flex items-center justify-center border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white active:translate-y-0 active:translate-x-0 active:shadow-none"
                      style={{ width: "48px", height: "48px" }}
                      aria-label={key}
                    >
                      {icons[key as SocialPlatform]}
                    </a>
                  ))}
              </div>
              <div className="p-4 text-center font-bold text-xs tracking-widest bg-gray-100">
                <Footer theme={activeTheme} username={data.username} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share handled by TemplateShare */}
    </>
  );
}

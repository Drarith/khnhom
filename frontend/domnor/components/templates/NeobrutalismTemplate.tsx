import { ProfileData } from "@/types/profileData";
import { themes } from "@/config/theme";
import Image from "next/image";
import { Share2, ExternalLink } from "lucide-react";
import TemplateShare from "./TemplateShare";
import { toast } from "react-toastify";

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
import { SocialShare } from "../shareSocial/ShareSocial";
import "./templates.css";
import Badge from "../badge/Badge";

type SocialPlatform =
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "telegram"
  | "youtube"
  | "github";

export default function NeobrutalismTemplate({ data }: { data: ProfileData }) {
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

  const primaryColor = activeTheme?.button || "#FFDE00";
  const secondaryColor = activeTheme?.bg || "#FFFFFF";
  const textColor = activeTheme?.text || "#000000";
  const accentColor = activeTheme?.border || "#000000";

  return (
    <>
      <div
        className="w-full min-h-screen flex flex-col font-sans relative md:rounded-2xl md:overflow-hidden"
        style={{
          backgroundColor: secondaryColor,
          color: textColor,
        }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none z-0"
          style={{
            backgroundImage: `radial-gradient(${textColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Background Image Layer */}
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-hard-light">
            <Image
              src={backgroundImage!}
              alt="background"
              fill
              className="object-cover contrast-125"
              priority
            />
          </div>
        )}

        <div className="relative z-10 w-full max-w-2xl mx-auto p-6 flex flex-col items-center min-h-screen space-y-8">
          {/* Profile Card */}
          <div
            className="w-full bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-10 transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative w-32 h-32 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                <Image
                  src={data.profilePictureUrl}
                  alt="profile picture"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl text-black font-black uppercase tracking-tight bg-white border-2 border-black px-4 py-1 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {data.displayName}
                </h1>
                <div className="block pt-2">
                  <Badge
                    username={data.username}
                    isSupporter={data.isSupporter}
                    isGoldSupporter={data.isGoldSupporter}
                    isVerified={data.isVerified}
                    isDev={data.isDev}
                  />
                </div>
              </div>
              {data.bio && (
                <p className="text-lg font-medium border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
                  {data.bio}
                </p>
              )}
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(data?.socials)
              .filter(([_, v]) => v !== "")
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  aria-label={key}
                >
                  {icons[key as SocialPlatform]}
                </a>
              ))}
          </div>

          {/* Links */}
          {data.links && data.links.length > 0 && (
            <div className="w-full space-y-5 text-black">
              {data.links.map((link) => (
                <div key={link._id} className="relative group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 px-8 text-center text-xl font-bold border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all active:shadow-none active:translate-x-[8px] active:translate-y-[8px]"
                  >
                    {link.title}
                  </a>
                  <TemplateShare
                    url={link.url}
                    title={link.title}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 border-2 border-black bg-yellow-300 hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    ariaLabel="Share link"
                  >
                    <Share2 size={18} />
                  </TemplateShare>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-8 font-bold">
            <Footer theme={activeTheme} username={data.username} />
          </div>
        </div>
      </div>

      {/* Share handled by TemplateShare */}
    </>
  );
}

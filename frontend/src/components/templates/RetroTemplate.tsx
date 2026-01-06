import { ProfileData } from "@/types/profileData";
import { themes } from "@/config/theme";
import Image from "next/image";
import { Share2 } from "lucide-react";
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
import { backgroundImages } from "@/config/background";
import Badge from "../badge/Badge";

type SocialPlatform =
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "telegram"
  | "youtube"
  | "github";

export default function RetroTemplate({ data }: { data: ProfileData }) {
  const activeTheme = themes.find((theme) => theme.name === data.theme);

  // Fallbacks
  const primaryColor = activeTheme?.text || "#4ade80"; // Phosphor color
  const secondaryColor = activeTheme?.button || "#22c55e"; // Highlight
  const bgColor = activeTheme?.bg || "#000000";
  const buttonTextColor = activeTheme?.buttonText || "#000000";

  const icons: Record<SocialPlatform, React.ReactElement> = {
    facebook: <SiFacebook className="w-5 h-5" />,
    x: <SiX className="w-5 h-5" />,
    instagram: <SiInstagram className="w-5 h-5" />,
    tiktok: <SiTiktok className="w-5 h-5" />,
    telegram: <SiTelegram className="w-5 h-5" />,
    youtube: <SiYoutube className="w-5 h-5" />,
    github: <SiGithub className="w-5 h-5" />,
  };

  const backgroundImage = backgroundImages.find(
    (bg) => bg.name === data.backgroundImage
  )?.url;

  return (
    <div className="min-h-screen w-full bg-neutral-900 flex items-center justify-center p-4 font-mono overflow-hidden relative">
      {/* CRT Monitor Casing Effect */}
      <div className="relative w-full  min-h-screen rounded-lg border-[16px] border-neutral-800 shadow-2xl overflow-hidden bg-black">
        {/* Screen Content */}
        <div
          className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
          style={{ backgroundColor: bgColor }}
        >
          {/* Background Image if exists */}
          {data.backgroundImage && backgroundImage && (
            <div className="absolute inset-0 opacity-20 z-0">
              <Image
                src={backgroundImage}
                alt="bg"
                fill
                className="object-cover grayscale"
              />
            </div>
          )}

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(${primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${primaryColor} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Main Content Container */}
          <div className="relative z-10 p-6 md:p-10 flex flex-col items-center gap-8 min-h-full">
            {/* Header / Status Bar */}
            <div
              className="w-full flex justify-between text-xs uppercase tracking-widest border-b pb-2 mb-4"
              style={{ borderColor: secondaryColor, color: secondaryColor }}
            >
              <span>SYS.PROFILE.V1</span>
              <span className="animate-pulse">ONLINE</span>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="relative group">
                <div
                  className="absolute -inset-2 border-2 border-dashed animate-[spin_10s_linear_infinite] rounded-full opacity-50"
                  style={{ borderColor: secondaryColor }}
                ></div>
                <div
                  className="relative w-32 h-32 border-4 overflow-hidden"
                  style={{
                    borderColor: primaryColor,
                    boxShadow: `0 0 15px ${primaryColor}40`,
                  }}
                >
                  {data.profilePictureUrl && (
                    <Image
                      src={data.profilePictureUrl}
                      alt={data.displayName}
                      fill
                      className="object-cover grayscale contrast-125"
                    />
                  )}
                  {/* Scanline on image */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1
                  className="text-3xl md:text-5xl font-bold uppercase tracking-tighter"
                  style={{
                    color: primaryColor,
                    textShadow: `2px 2px 0px ${secondaryColor}`,
                  }}
                >
                  {data.displayName}
                </h1>
                <div className="flex justify-center items-center gap-2">
                  <Badge
                    username={data.username}
                    isSupporter={data.isSupporter}
                    isGoldSupporter={data.isGoldSupporter}
                    isVerified={data.isVerified}
                    isDev={data.isDev}
                    isSpecial={data.isSpecial}
                  />
                </div>
              </div>

              {data.bio && (
                <div
                  className="max-w-lg w-full border-l-4 pl-4 py-2 bg-black/20 backdrop-blur-sm"
                  style={{ borderColor: secondaryColor }}
                >
                  <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: primaryColor }}
                  >
                    <span className="mr-2 opacity-50">{">"}</span>
                    {data.bio}
                    <span
                      className="inline-block w-2 h-4 ml-1 align-middle animate-pulse"
                      style={{ backgroundColor: primaryColor }}
                    ></span>
                  </p>
                </div>
              )}
            </div>

            {/* Socials */}
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-xl">
              {Object.entries(data?.socials || {})
                .filter(([_, v]) => v)
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border hover:scale-110 transition-transform duration-200 bg-black/10"
                    style={{
                      borderColor: secondaryColor,
                      color: secondaryColor,
                      boxShadow: `4px 4px 0px ${secondaryColor}40`,
                    }}
                  >
                    {icons[key as SocialPlatform]}
                  </a>
                ))}
            </div>

            {/* Links */}
            <div className="w-full max-w-xl space-y-4 mt-4">
              {data.links?.map((link) => (
                <div key={link._id} className="relative group w-full">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-4 border-2 text-center uppercase font-bold tracking-widest transition-all hover:-translate-y-1 hover:translate-x-1"
                    style={{
                      borderColor: primaryColor,
                      color: buttonTextColor,
                      backgroundColor: secondaryColor,
                      boxShadow: `6px 6px 0px ${primaryColor}80`,
                    }}
                  >
                    {link.title}
                  </a>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TemplateShare
                      url={link.url}
                      title={link.title}
                      style={{ color: buttonTextColor }}
                    >
                      <Share2 size={16} />
                    </TemplateShare>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / System Info */}
            <div
              className="mt-auto pt-10 w-full text-center text-[10px] uppercase opacity-60"
              style={{ color: primaryColor }}
            >
              MEM: 64KB OK • SYSTEM: DOMNOR-OS • {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* CRT Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none z-50 rounded-lg shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>
        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat"></div>
        <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.4)_100%)]"></div>
      </div>
    </div>
  );
}

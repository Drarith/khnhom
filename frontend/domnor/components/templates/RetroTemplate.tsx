import { ProfileData } from "@/types/profileData";
import { themes } from "@/config/theme";
import Image from "next/image";
import { Share2, ExternalLink } from "lucide-react";
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

export default function RetroTemplate({ data }: { data: ProfileData }) {
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

  const primaryColor = activeTheme?.text || "#4ade80";
  const secondaryColor = activeTheme?.button || "#22c55e";

  return (
    <div
      className="w-full min-h-screen flex flex-col relative font-mono overflow-hidden"
      style={{ backgroundColor: activeTheme?.bg }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Background Image Layer */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-30 grayscale contrast-125">
          <Image
            src={backgroundImage!}
            alt="background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <div
          className="w-full border-4 p-6 bg-black shadow-[8px_8px_0px_0px]"
          style={{
            borderColor: secondaryColor,
            boxShadow: `8px 8px 0px 0px ${secondaryColor}`,
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div
              className="relative w-32 h-32 shrink-0 border-2"
              style={{ borderColor: secondaryColor }}
            >
              <Image
                src={data.profilePictureUrl}
                alt="profile picture"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                priority
              />
            </div>
            <div className="text-center md:text-left space-y-2 w-full">
              <h1
                className="text-3xl md:text-4xl font-bold uppercase tracking-widest glitch-text"
                style={{ color: primaryColor }}
              >
                {data.displayName}
              </h1>
              <h4 className="font-bold" style={{ color: secondaryColor }}>
                @{data.username}
              </h4>
              {data.bio && (
                <p
                  className="text-sm leading-relaxed border-t pt-2 mt-2"
                  style={{
                    color: primaryColor,
                    opacity: 0.8,
                    borderColor: `${secondaryColor}80`,
                  }}
                >
                  {">"} {data.bio}
                  <span className="animate-pulse">_</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(data?.socials || {})
            .filter(([_, v]) => v !== "")
            .map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-colors"
                style={{ color: secondaryColor }}
                aria-label={key}
              >
                {icons[key as SocialPlatform]}
              </a>
            ))}
        </div>

        {/* Links */}
        {data.links && data.links.length > 0 && (
          <div className="w-full space-y-4">
            {data.links.map((link) => (
              <div key={link._id} className="relative group">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center border-2 bg-black py-4 pl-4 pr-14 font-bold text-lg uppercase tracking-wider transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                  style={{
                    borderColor: secondaryColor,
                    color: primaryColor,
                    boxShadow: `4px 4px 0px 0px ${secondaryColor}80`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = secondaryColor;
                    e.currentTarget.style.color = "black";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "black";
                    e.currentTarget.style.color = primaryColor;
                    e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${secondaryColor}80`;
                  }}
                >
                  [{link.title}]
                </a>
                <TemplateShare
                  url={link.url}
                  title={link.title}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-colors z-10 bg-black border-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                  ariaLabel="Share link"
                  style={{ color: secondaryColor, borderColor: secondaryColor }}
                >
                  <Share2 size={18} />
                </TemplateShare>
              </div>
            ))}
          </div>
        )}

        <div
          className="mt-8 text-xs uppercase"
          style={{ color: secondaryColor }}
        >
          SYSTEM READY...
        </div>
      </div>
    </div>
  );
}

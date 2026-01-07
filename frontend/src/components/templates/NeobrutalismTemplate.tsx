import { ProfileData } from "@/types/profileData";
import { themes } from "@/config/theme";
import Image from "next/image";
import { Share2} from "lucide-react";
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
import { LinkedInIcon } from "../shareSocial/LinkedInIcon";

import Footer from "../userProfile/Footer";
import { backgroundImages } from "@/config/background";
import "./templates.css";
import Badge from "../badge/Badge";

type SocialPlatform =
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "telegram"
  | "youtube"
  | "github"
  | "linkedin";

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
    linkedin: <LinkedInIcon className="w-6 h-6" size={24} />,
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
            backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
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
            className="w-full border-4 p-8 mt-10 transform hover:-translate-y-1 transition-all duration-200"
            style={{
              backgroundColor: primaryColor,
              borderColor: accentColor,
              boxShadow: `8px 8px 0px 0px ${accentColor}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `12px 12px 0px 0px ${accentColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `8px 8px 0px 0px ${accentColor}`;
            }}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div
                className="relative w-32 h-32 border-4"
                style={{
                  borderColor: accentColor,
                  boxShadow: `4px 4px 0px 0px ${accentColor}`,
                  backgroundColor: secondaryColor,
                }}
              >
                {data.profilePictureUrl && (
                  <Image
                    src={data.profilePictureUrl}
                    alt="profile picture"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
              <div className="space-y-2">
                <h1
                  className="text-4xl font-black uppercase tracking-tight border-2 px-4 py-1 inline-block break-words"
                  style={{
                    color: textColor,
                    backgroundColor: secondaryColor,
                    borderColor: accentColor,
                    boxShadow: `4px 4px 0px 0px ${accentColor}`,
                  }}
                >
                  {data.displayName}
                </h1>
                <div className="block pt-2" style={{ color: textColor }}>
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
                <p
                  className="text-lg font-medium border-2 p-4 w-full break-words"
                  style={{
                    borderColor: accentColor,
                    backgroundColor: secondaryColor,
                    boxShadow: `4px 4px 0px 0px ${accentColor}`,
                    color: textColor,
                  }}
                >
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
                  className="p-3 border-2 hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  style={{
                    backgroundColor: secondaryColor,
                    borderColor: accentColor,
                    boxShadow: `4px 4px 0px 0px ${accentColor}`,
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `2px 2px 0px 0px ${accentColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${accentColor}`;
                  }}
                  aria-label={key}
                >
                  {icons[key as SocialPlatform]}
                </a>
              ))}
          </div>

          {/* Links */}
          {data.links && data.links.length > 0 && (
            <div className="w-full space-y-5" style={{ color: textColor }}>
              {data.links.map((link) => (
                <div key={link._id} className="relative group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 px-8 text-center text-xl font-bold border-4 hover:translate-x-[4px] hover:translate-y-[4px] transition-all active:shadow-none active:translate-x-[8px] active:translate-y-[8px]"
                    style={{
                      borderColor: accentColor,
                      backgroundColor: secondaryColor,
                      boxShadow: `8px 8px 0px 0px ${accentColor}`,
                      color: textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${accentColor}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `8px 8px 0px 0px ${accentColor}`;
                    }}
                  >
                    {link.title}
                  </a>
                  <TemplateShare
                    url={link.url}
                    title={link.title}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 border-2 transition-all"
                    style={{
                      borderColor: accentColor,
                      backgroundColor: primaryColor,
                      boxShadow: `2px 2px 0px 0px ${accentColor}`,
                      color: textColor,
                    }}
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

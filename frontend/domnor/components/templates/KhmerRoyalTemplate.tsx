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
import Badge from "../badge/Badge";

type SocialPlatform =
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "telegram"
  | "youtube"
  | "github";

export default function KhmerRoyalTemplate({ data }: { data: ProfileData }) {
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

  // Khmer Royal Colors
  const gold = "#FFD700";
  const darkGold = "#B8860B";
  const royalBlue = "#002366";
  const deepRed = "#8B0000";

  const primaryColor = activeTheme?.text || gold;
  const secondaryColor = activeTheme?.button || darkGold;
  const bgColor = activeTheme?.bg || royalBlue;

  return (
    <>
      <div
        className="w-full min-h-screen flex flex-col font-serif relative overflow-hidden md:rounded-2xl"
        style={{
          backgroundColor: bgColor,
          color: primaryColor,
        }}
      >
        {/* Decorative Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${gold} 1px, transparent 1px), radial-gradient(${gold} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        />

        {/* Background Image Layer */}
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
            <Image
              src={backgroundImage!}
              alt="background"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-2xl mx-auto p-6 flex flex-col items-center min-h-screen">
          {/* Top Ornament */}
          <div className="w-full h-16 mb-8 relative flex justify-center items-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            <div className="absolute w-4 h-4 rotate-45 bg-yellow-500 border-2 border-white"></div>
          </div>

          {/* Profile Section */}
          <div className="relative mb-12 text-center">
            {/* Frame */}
            <div className="absolute -inset-4 border-2 border-yellow-500/50 rotate-45 rounded-3xl"></div>
            <div className="absolute -inset-4 border-2 border-yellow-500/50 -rotate-12 rounded-3xl"></div>

            <div className="relative w-40 h-40 mx-auto mb-6 rounded-full border-4 border-yellow-500 shadow-[0_0_20px_rgba(255,215,0,0.3)] overflow-hidden">
              <Image
                src={data.profilePictureUrl}
                alt="profile picture"
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 drop-shadow-sm break-words">
              {data.displayName}
            </h1>
            <div className={`block pt-2 text-${primaryColor}`}>
              <Badge
                username={data.username}
                isSupporter={data.isSupporter}
                isGoldSupporter={data.isGoldSupporter}
                isVerified={data.isVerified}
                isDev={data.isDev}
              />
            </div>
          </div>

          {/* Bio */}
          {data.bio && (
            <div className="mb-12 text-center max-w-md relative p-6">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/50"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/50"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/50"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/50"></div>
              <p className="text-lg leading-relaxed italic text-yellow-50p break-words">
                {data.bio}
              </p>
            </div>
          )}

          {/* Social Icons */}
          <div className="flex gap-6 mb-12">
            {Object.entries(data?.socials)
              .filter(([_, v]) => v !== "")
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500 hover:text-yellow-200 transition-colors transform hover:scale-110 hover:rotate-6"
                  aria-label={key}
                >
                  {icons[key as SocialPlatform]}
                </a>
              ))}
          </div>

          {/* Links */}
          {data.links && data.links.length > 0 && (
            <div className="w-full space-y-6 mb-12">
              {data.links.map((link) => (
                <div key={link._id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full py-4 px-8 text-center text-xl font-medium border border-yellow-500/30 bg-black/20 backdrop-blur-sm rounded-lg hover:bg-yellow-900/30 transition-all duration-500 group-hover:border-yellow-400"
                    style={{ color: gold }}
                  >
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      ✦
                    </span>
                    {link.title}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      ✦
                    </span>
                  </a>
                  <TemplateShare
                    url={link.url}
                    title={link.title}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-yellow-500/50 hover:text-yellow-200 transition-colors z-20"
                    ariaLabel="Share link"
                  >
                    <Share2 size={16} />
                  </TemplateShare>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-8 opacity-60">
            <Footer theme={activeTheme} username={data.username} />
          </div>
        </div>
      </div>

      {/* Share handled by TemplateShare */}
    </>
  );
}

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

export default function MinimalismTemplate({ data }: { data: ProfileData }) {
  const activeTheme = themes.find((theme) => {
    return theme.name === data.theme;
  });
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
    <>
      <div
        className="w-full min-h-screen flex flex-col items-center font-sans selection:bg-zinc-100 relative"
        style={{
          backgroundColor: activeTheme?.bg || "#ffffff",
          color: activeTheme?.text || "#18181b",
        }}
      >
        {/* Background Image Layer */}
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage!}
              alt="background"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
        )}

        <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-20 flex flex-col items-center space-y-12">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden ring-1"
              style={{
                backgroundColor: activeTheme?.button || "#f4f4f5",
                borderColor:
                  activeTheme?.border || activeTheme?.button || "#e4e4e7",
              }}
            >
              <Image
                src={data.profilePictureUrl}
                alt="profile picture"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-2">
              <h1
                className="text-2xl font-medium tracking-tight break-words"
                style={{ color: activeTheme?.text }}
              >
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
              <p
                className="text-sm max-w-sm leading-relaxed font-light break-words"
                style={{ color: activeTheme?.text, opacity: 0.7 }}
              >
                {data.bio}
              </p>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-6 justify-center">
            {Object.entries(data?.socials)
              .filter(([_, v]) => v !== "")
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300"
                  style={{ color: activeTheme?.text, opacity: 0.4 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.4";
                  }}
                  aria-label={key}
                >
                  {icons[key as SocialPlatform]}
                </a>
              ))}
          </div>

          {/* Links */}
          {data.links && data.links.length > 0 && (
            <div className="w-full space-y-3">
              {data.links.map((link) => (
                <div key={link._id} className="group relative">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 pl-6 pr-12 text-center text-sm font-medium border rounded-lg transition-all duration-300 bg-transparent"
                    style={{
                      borderColor:
                        activeTheme?.border || activeTheme?.button || "#e4e4e7",
                      color: activeTheme?.text,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        activeTheme?.text || "#18181b";
                      e.currentTarget.style.backgroundColor =
                        activeTheme?.text || "#18181b";
                      e.currentTarget.style.color =
                        activeTheme?.bg || "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        activeTheme?.border || activeTheme?.button || "#e4e4e7";
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        activeTheme?.text || "#18181b";
                    }}
                  >
                    {link.title}
                  </a>
                  <TemplateShare
                    url={link.url}
                    title={link.title}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 duration-300"
                    ariaLabel="Share link"
                    style={{ color: activeTheme?.text }}
                  >
                    <Share2 size={14} />
                  </TemplateShare>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-12 opacity-50 hover:opacity-100 transition-opacity duration-500">
            <Footer theme={activeTheme} username={data.username} />
          </div>
        </div>
      </div>

      {/* Share handled by TemplateShare */}
    </>
  );
}

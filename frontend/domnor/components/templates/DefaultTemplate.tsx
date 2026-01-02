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

export default function DefaultTemplate({ data }: { data: ProfileData }) {
  const activeTheme = themes.find((theme) => {
    return theme.name === data.theme;
  });
  const icons: Record<SocialPlatform, React.ReactElement> = {
    facebook: <SiFacebook className="w-7 h-7" color={activeTheme?.text} />,
    x: <SiX className="w-7 h-7" color={activeTheme?.text} />,
    instagram: <SiInstagram className="w-7 h-7" color={activeTheme?.text} />,
    tiktok: <SiTiktok className="w-7 h-7" color={activeTheme?.text} />,
    telegram: <SiTelegram className="w-7 h-7" color={activeTheme?.text} />,
    youtube: <SiYoutube className="w-7 h-7" color={activeTheme?.text} />,
    github: <SiGithub className="w-7 h-7" color={activeTheme?.text} />,
  };

  const backgroundImage = backgroundImages.find(
    (bg) => bg.name === data.backgroundImage
  )?.url;

  return (
    <>
      <div className="w-full min-h-screen flex flex-col relative md:shadow-2xl md:rounded-2xl md:overflow-hidden">
        {/* Background Image Layer */}
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage!}
              alt="background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay to ensure text readability */}
            {/* <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, ${activeTheme?.bg} 100%)`,
                opacity: 0.9,
              }}
            /> */}
          </div>
        )}

        <div className="relative w-full h-96 shrink-0 z-10">
          <Image
            src={data.profilePictureUrl}
            alt="profile picture"
            fill
            className="object-cover"
            priority
            style={{
              maskImage: backgroundImage
                ? "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)"
                : "none",
              WebkitMaskImage: backgroundImage
                ? "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)"
                : "none",
            }}
          />

          {!backgroundImage && (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, transparent, transparent, ${activeTheme?.bg})`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-32"
                style={{
                  background: `linear-gradient(to top, ${activeTheme?.bg}, transparent)`,
                }}
              />
            </>
          )}
        </div>

        <div className="relative -mt-20 px-4 pb-12 flex-1 flex flex-col items-center w-full space-y-6 z-10">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm break-words">
              {data.displayName}
            </h1>
            <h4 className="font-bold">@{data.username}</h4>
            {data.bio && (
              <p className="text-lg opacity-90 max-w-lg mx-auto leading-relaxed font-medium break-words px-6">
                {data.bio}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(data?.socials)
              .filter(([_, v]) => v !== "")
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full transition-transform hover:scale-110 hover:bg-white/10"
                  aria-label={key}
                >
                  {icons[key as SocialPlatform]}
                </a>
              ))}
          </div>

          {data.links && data.links.length > 0 && (
            <div className="w-full space-y-4 mt-4">
              {data.links.map((link) => (
                <div key={link._id} className="relative group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center rounded-xl py-4 px-12 font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    style={{
                      backgroundColor: activeTheme?.button,
                      color: activeTheme?.buttonText,
                    }}
                  >
                    {link.title}
                  </a>
                  <TemplateShare
                    url={link.url}
                    title={link.title}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 transition-colors"
                    ariaLabel="Share link"
                    style={{ color: activeTheme?.buttonText }}
                  >
                    <Share2 size={18} />
                  </TemplateShare>
                </div>
              ))}
            </div>
          )}
          <div className="mt-auto">
            <Footer theme={activeTheme} username={data.username} />
          </div>
        </div>
      </div>
      {/* Share handled by TemplateShare */}
    </>
  );
}

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

export default function GlassmorphismTemplate({ data }: { data: ProfileData }) {
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

  return (
    <>
      <div
        className="w-full min-h-screen flex flex-col relative overflow-hidden"
        style={{
          backgroundColor: activeTheme?.bg || "#4f46e5",
          color: activeTheme?.text || "#ffffff",
        }}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {data.backgroundImage ? (
            <Image
              src={backgroundImage!}
              alt="background"
              fill
              className="object-cover opacity-60 mix-blend-overlay"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-black/10" />
          )}
          {/* Floating Orbs */}
          <div
            className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob"
            style={{ backgroundColor: activeTheme?.button || "#60a5fa" }}
          ></div>
          <div
            className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-2000"
            style={{ backgroundColor: activeTheme?.text || "#c084fc" }}
          ></div>
          <div
            className="absolute bottom-[-20%] left-[20%] w-96 h-96 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-4000"
            style={{ backgroundColor: activeTheme?.button || "#f472b6" }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto p-6 min-h-screen">
          {/* Glass Card Container */}
          <div className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl mt-10 mb-10">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-6 mb-8">
              <div className="relative w-32 h-32 rounded-full p-1 bg-linear-to-tr from-white/50 to-transparent">
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20">
                  {data.profilePictureUrl &&<Image
                    src={data.profilePictureUrl}
                    alt="profile picture"
                    fill
                    className="object-cover"
                    priority
                  />}
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md break-words">
                  {data.displayName}
                </h1>
                <div className={`block pt-2 text-${activeTheme?.text}`}>
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
                <p className="opacity-90 max-w-md leading-relaxed font-light text-lg break-words">
                  {data.bio}
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              {Object.entries(data?.socials)
                .filter(([_, v]) => v !== "")
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 backdrop-blur-md"
                    aria-label={key}
                    style={{ color: activeTheme?.text || "#ffffff" }}
                  >
                    <div>{icons[key as SocialPlatform]}</div>
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
                      className="block w-full py-4 px-6 text-center text-lg font-semibold bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                      style={{ color: activeTheme?.text || "#ffffff" }}
                    >
                      {link.title}
                    </a>
                    <TemplateShare
                      url={link.url}
                      title={link.title}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors"
                      ariaLabel="Share link"
                      style={{
                        color: activeTheme?.text || "#ffffff",
                        opacity: 0.7,
                      }}
                    >
                      <Share2 size={18} />
                    </TemplateShare>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto pb-6 text-white/50">
            <Footer theme={activeTheme} username={data.username} />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {/* Share handled by TemplateShare */}
    </>
  );
}

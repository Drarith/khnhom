import { ProfileData } from "@/types/profileData";
import { themes } from "@/config/theme";
import Image from "next/image";
import { Share2, X, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
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

  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({ isOpen: false, url: "", title: "" });
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent, url: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShareModal({ isOpen: true, url, title });
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareModal.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied");
    } catch (err) {
      console.error(err);
      toast.error("Error");
    }
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
                ringColor:
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
                className="text-2xl font-medium tracking-tight"
                style={{ color: activeTheme?.text }}
              >
                {data.displayName}
              </h1>
              <h4
                className="text-sm font-normal"
                style={{ color: activeTheme?.text, opacity: 0.6 }}
              >
                @{data.username}
              </h4>
            </div>
            {data.bio && (
              <p
                className="text-sm max-w-sm leading-relaxed font-light"
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
                  <button
                    onClick={(e) => handleShare(e, link.url, link.title)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 duration-300"
                    style={{ color: activeTheme?.text }}
                    aria-label="Share link"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-12 opacity-50 hover:opacity-100 transition-opacity duration-500">
            <Footer theme={activeTheme} username={data.username} />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm"
          onClick={() => setShareModal({ ...shareModal, isOpen: false })}
        >
          <div
            className="bg-white w-full max-w-sm p-8 space-y-8 shadow-2xl rounded-2xl border border-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-zinc-900">Share</h3>
              <button
                onClick={() => setShareModal({ ...shareModal, isOpen: false })}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs text-zinc-500">
                      {shareModal.url}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`text-xs font-medium transition-colors ${
                      copied
                        ? "text-green-600"
                        : "text-zinc-900 hover:text-zinc-600"
                    }`}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <a
                href={shareModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                <span>Visit</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

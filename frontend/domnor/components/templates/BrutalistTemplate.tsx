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

export default function BrutalistTemplate({ data }: { data: ProfileData }) {
  const activeTheme = themes.find((theme) => {
    return theme.name === data.theme;
  });

  // Default to black/white if theme is missing
  const bgColor = activeTheme?.bg || "#ffffff";
  const textColor = activeTheme?.text || "#000000";
  const buttonColor = activeTheme?.button || "#000000";
  const buttonTextColor = activeTheme?.buttonText || "#ffffff";
  const backgroundImage = backgroundImages.find(
    (bg) => bg.name === data.backgroundImage
  )?.url;

  const haveBackgroundImage = Boolean(backgroundImage);

  const icons: Record<SocialPlatform, React.ReactElement> = {
    facebook: <SiFacebook className="w-6 h-6" color={textColor} />,
    x: <SiX className="w-6 h-6" color={textColor} />,
    instagram: <SiInstagram className="w-6 h-6" color={textColor} />,
    tiktok: <SiTiktok className="w-6 h-6" color={textColor} />,
    telegram: <SiTelegram className="w-6 h-6" color={textColor} />,
    youtube: <SiYoutube className="w-6 h-6" color={textColor} />,
    github: <SiGithub className="w-6 h-6" color={textColor} />,
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
      toast.success("Link copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="font-mono w-full min-h-screen md:p-0 flex flex-col" style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      {/* Main Card */}
      <div
        className="w-full min-h-screen border-4 p-6 relative bg-white/5 flex flex-col"
        style={{
          borderColor: textColor,
          boxShadow: `12px 12px 0px 0px ${textColor}`,
        }}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-6 mb-8">
          <div className="relative w-32 h-32">
            <Image
              src={data.profilePictureUrl}
              alt="profile picture"
              fill
              className="object-cover border-4"
              style={{
                borderColor: textColor,
                boxShadow: `8px 8px 0px 0px ${textColor}`,
              }}
              priority
            />
          </div>

          <div className="text-center space-y-2 w-full">
            <h1
              className="text-3xl font-black uppercase tracking-tighter break-words"
              style={{
                textShadow: `2px 2px 0px ${
                  textColor === "#000000" ? "#cccccc" : "#000000"
                }`,
              }}
            >
              {data.displayName}
            </h1>
            <div
              className="inline-block px-2 py-1 font-bold text-sm border-2"
              style={{ borderColor: textColor }}
            >
              @{data.username}
            </div>
          </div>

          {data.bio && (
            <p
              className="text-center font-bold leading-tight max-w-xs border-l-4 pl-4 italic"
              style={{ borderColor: textColor }}
            >
              {data.bio}
            </p>
          )}
        </div>

        {/* Socials */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {Object.entries(data?.socials)
            .filter(([_, v]) => v !== "")
            .map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                style={{
                  borderColor: textColor,
                  boxShadow: `6px 6px 0px 0px ${textColor}`,
                }}
                aria-label={key}
              >
                {icons[key as SocialPlatform]}
              </a>
            ))}
        </div>

        {/* Links */}
        {data.links && data.links.length > 0 && (
          <div className="w-full space-y-5 flex-1">
            {data.links.map((link) => (
              <div key={link._id} className="relative group">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center border-2 py-4 px-10 font-black text-lg uppercase tracking-wide transition-all hover:-translate-y-1 active:translate-y-0"
                  style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                    borderColor: textColor,
                    boxShadow: `8px 8px 0px 0px ${textColor}`,
                  }}
                >
                  {link.title}
                </a>
                <button
                  onClick={(e) => handleShare(e, link.url, link.title)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 border-l-2 hover:bg-black/10 transition-colors"
                  aria-label="Share link"
                  style={{
                    color: buttonTextColor,
                    borderColor: buttonTextColor,
                  }}
                >
                  <Share2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-auto">
          <Footer
            theme={{ bg: bgColor, text: textColor }}
            username={data.username}
          />
        </div>
      </div>

      {/* Share Modal - Brutalist Style */}
      {shareModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShareModal({ ...shareModal, isOpen: false })}
        >
          <div
            className="w-full max-w-sm p-6 border-4 relative"
            style={{
              background: haveBackgroundImage ? `url(${backgroundImage})` : bgColor,
              borderColor: textColor,
              boxShadow: `16px 16px 0px 0px ${textColor}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-between items-center mb-6 border-b-4 pb-2"
              style={{ borderColor: textColor }}
            >
              <h3 className="text-xl font-black uppercase">Share Link</h3>
              <button
                onClick={() => setShareModal({ ...shareModal, isOpen: false })}
                className="p-1 hover:bg-black/10 transition-colors"
              >
                <X size={24} color={textColor} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase">Page Link</p>
                <div
                  className="flex items-stretch border-2"
                  style={{ borderColor: textColor }}
                >
                  <div className="flex-1 min-w-0 p-3 bg-gray-100 dark:bg-gray-800">
                    <p
                      className="truncate text-sm font-mono"
                      style={{ color: "#000000" }}
                    >
                      {shareModal.url}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 font-bold border-l-2 transition-all hover:bg-gray-200"
                    style={{ borderColor: textColor, color: textColor }}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <a
                href={shareModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 font-black uppercase hover:-translate-y-1 transition-all"
                style={{
                  backgroundColor: textColor,
                  color: bgColor,
                  borderColor: textColor,
                  boxShadow: `8px 8px 0px 0px ${textColor}`,
                }}
              >
                <span>Open</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

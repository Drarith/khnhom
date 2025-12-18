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
      console.error(err);
      toast.error("Failed to copy");
    }
  };

  const backgroundImage = backgroundImages.find(
    (bg) => bg.name === data.backgroundImage
  )?.url;

  return (
    <>
      <div className="w-full min-h-screen flex flex-col relative shadow-2xl md:rounded-2xl md:overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm">
              {data.displayName}
            </h1>
            <h4 className="font-bold">@{data.username}</h4>
            {data.bio && (
              <p className="text-lg opacity-90 max-w-lg mx-auto leading-relaxed font-medium">
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
                  <button
                    onClick={(e) => handleShare(e, link.url, link.title)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 transition-colors"
                    aria-label="Share link"
                    style={{ color: activeTheme?.buttonText }}
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-auto">
            <Footer theme={activeTheme} username={data.username} />
          </div>
        </div>
      </div>
      {shareModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200"
          onClick={() => setShareModal({ ...shareModal, isOpen: false })}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-6 space-y-6 shadow-2xl transform transition-all animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Share this link
              </h3>
              <button
                onClick={() => setShareModal({ ...shareModal, isOpen: false })}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 ml-1">
                  Page Link
                </p>
                <div className="flex items-center gap-2 p-2 pr-2 pl-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {shareModal.url}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      copied
                        ? "bg-green-500 text-white shadow-green-200"
                        : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <a
                href={shareModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white bg-black dark:bg-white dark:text-black hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <span>Continue to site</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

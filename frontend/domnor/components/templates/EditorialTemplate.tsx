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

export default function EditorialTemplate({ data }: { data: ProfileData }) {
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
        className="w-full min-h-screen flex flex-col font-serif selection:bg-zinc-200"
        style={{
          backgroundColor: activeTheme?.bg || "#ffffff",
          color: activeTheme?.text || "#000000",
        }}
      >
        {/* Background Image Layer */}
        {data.backgroundImage && (
          <div className="fixed inset-0 z-0 opacity-30">
            <Image
              src={backgroundImage!}
              alt="background"
              fill
              className="object-cover grayscale-0 lg:grayscale lg:hover:grayscale-0 transition-all duration-700"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/90"
              style={{ mixBlendMode: "overlay" }}
            ></div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-3xl mx-auto px-8 py-20 flex flex-col min-h-screen">
          {/* Header Section */}
          <header
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 border-b-2 pb-8"
            style={{ borderColor: activeTheme?.text || "#000000" }}
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                {data.displayName}
              </h1>
              <p className="text-xl italic opacity-70">@{data.username}</p>
            </div>

            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 grayscale-0 lg:grayscale lg:hover:grayscale-0 transition-all duration-500">
              <Image
                src={data.profilePictureUrl}
                alt="profile picture"
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>

          {/* Bio Section */}
          {data.bio && (
            <section className="mb-20 max-w-xl">
              <p className="text-2xl leading-relaxed font-light">{data.bio}</p>
            </section>
          )}

          {/* Links Section */}
          {data.links && data.links.length > 0 && (
            <section className="w-full space-y-0 mb-20">
              <h3 className="text-xs uppercase tracking-widest mb-6 opacity-50 font-sans">
                Selected Links
              </h3>
              {data.links.map((link, index) => (
                <div
                  key={link._id}
                  className="group relative border-t transition-all duration-300 hover:pl-4"
                  style={{
                    borderColor: `${activeTheme?.text}40` || "#00000040",
                  }}
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full py-6 text-xl md:text-2xl italic lg:not-italic lg:hover:italic"
                  >
                    <span>{link.title}</span>
                    <span className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity text-sm font-sans">
                      ↗
                    </span>
                  </a>
                  <button
                    onClick={(e) => handleShare(e, link.url, link.title)}
                    className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 opacity-100 lg:opacity-0 lg:group-hover:opacity-50 hover:!opacity-100 transition-all"
                    aria-label="Share link"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              ))}
              <div
                className="border-t"
                style={{ borderColor: `${activeTheme?.text}40` || "#00000040" }}
              ></div>
            </section>
          )}

          {/* Footer Section */}
          <footer className="mt-auto flex flex-col md:flex-row justify-between items-center gap-8 pt-8">
            <div className="flex gap-6">
              {Object.entries(data?.socials)
                .filter(([_, v]) => v !== "")
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                    aria-label={key}
                  >
                    {icons[key as SocialPlatform]}
                  </a>
                ))}
            </div>
            <div className="opacity-50 text-sm font-sans">
              <Footer theme={activeTheme} username={data.username} />
            </div>
          </footer>
        </div>
      </div>

      {/* Share Modal */}
      {shareModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm font-serif"
          onClick={() => setShareModal({ ...shareModal, isOpen: false })}
        >
          <div
            className="bg-white w-full max-w-md p-12 shadow-2xl border border-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold italic">Share</h3>
              <button
                onClick={() => setShareModal({ ...shareModal, isOpen: false })}
                className="hover:opacity-50 transition-opacity"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest opacity-50 font-sans">
                  Link
                </p>
                <div className="flex items-center gap-4 border-b border-black pb-2">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-lg">{shareModal.url}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="text-sm font-sans uppercase tracking-wider hover:underline"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <a
                href={shareModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white hover:bg-zinc-800 transition-colors font-sans uppercase tracking-widest text-sm"
              >
                <span>Visit Link</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

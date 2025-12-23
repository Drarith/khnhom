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

  // Retro specific styles
  const retroBg = {
    backgroundColor: activeTheme?.bg || "#18181b",
    backgroundImage: `
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
    `,
    backgroundSize: "100% 2px, 3px 100%",
    color: activeTheme?.text || "#4ade80",
  };

  const primaryColor = activeTheme?.text || "#4ade80";
  const secondaryColor = activeTheme?.button || "#22c55e";

  return (
    <>
      <div 
        className="w-full min-h-screen flex flex-col relative font-mono overflow-hidden"
        style={retroBg}
      >
        {/* CRT Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-20" style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 2px, 3px 100%"
        }}></div>
        
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
              boxShadow: `8px 8px 0px 0px ${secondaryColor}`
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
                <h4 
                  className="font-bold"
                  style={{ color: secondaryColor }}
                >
                  @{data.username}
                </h4>
                {data.bio && (
                  <p 
                    className="text-sm leading-relaxed border-t pt-2 mt-2"
                    style={{ 
                      color: primaryColor, 
                      opacity: 0.8,
                      borderColor: `${secondaryColor}80`
                    }}
                  >
                    {">"} {data.bio}
                    <span className="animate-pulse">_</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div 
            className="flex flex-wrap gap-4 justify-center bg-black border-2 p-4 w-full"
            style={{ borderColor: secondaryColor }}
          >
            {Object.entries(data?.socials)
              .filter(([_, v]) => v !== "")
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 transition-colors border border-transparent"
                  style={{ color: secondaryColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = secondaryColor;
                    e.currentTarget.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = secondaryColor;
                  }}
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
                    className="w-full block text-center border-2 bg-black py-4 px-12 font-bold text-lg uppercase tracking-wider transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                    style={{ 
                      borderColor: secondaryColor,
                      color: primaryColor,
                      boxShadow: `4px 4px 0px 0px ${secondaryColor}80`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = secondaryColor;
                      e.currentTarget.style.color = 'black';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'black';
                      e.currentTarget.style.color = primaryColor;
                      e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${secondaryColor}80`;
                    }}
                  >
                    [{link.title}]
                  </a>
                  <button
                    onClick={(e) => handleShare(e, link.url, link.title)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-colors"
                    style={{ color: secondaryColor }}
                    aria-label="Share link"
                  >
                    <Share2 size={18} />
                  </button>
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

      {/* Share Modal */}
      {shareModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 font-mono"
          onClick={() => setShareModal({ ...shareModal, isOpen: false })}
        >
          <div
            className="bg-black border-4 border-green-500 w-full max-w-sm p-6 space-y-6 shadow-[10px_10px_0px_0px_rgba(34,197,94,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b-2 border-green-900 pb-4">
              <h3 className="text-xl font-bold text-green-400 uppercase">
                Share Protocol
              </h3>
              <button
                onClick={() => setShareModal({ ...shareModal, isOpen: false })}
                className="text-green-600 hover:text-green-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-green-700 uppercase">
                  Target URL
                </p>
                <div className="flex items-center gap-2 p-2 border-2 border-green-800 bg-green-950/20">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-green-400 font-mono">
                      {shareModal.url}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-3 py-1 border border-green-600 text-xs uppercase transition-all ${
                      copied
                        ? "bg-green-500 text-black"
                        : "bg-black text-green-500 hover:bg-green-900"
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "ACK" : "CPY"}
                  </button>
                </div>
              </div>

              <a
                href={shareModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold uppercase transition-all"
              >
                <span>Execute</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

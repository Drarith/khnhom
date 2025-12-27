'use client';

import React, { useState, useEffect } from "react";
import {
  Copy,
  X,
  Share2,
  MessageCircle,
  Send,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.112.309 2.298.474 3.523.474 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.194L10.5 11.234l-5.26 3.011 5.791-6.145 2.791 2.959 5.259-3.011-5.79 6.146z" />
  </svg>
);

function checkNativeShareSupport() {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    return true;
  }
  return false;
}

export const SocialShare = ({
  url = window.location.href,
  title = "Check out my profile!",
  onClose = () => {},
}) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const isNavtiveShareSupported = checkNativeShareSupport();

  if (isNavtiveShareSupported && !canNativeShare) {
    setCanNativeShare(true);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch (err) {
      console.log("User cancelled or share failed");
    }
  };

  const platforms = [
    {
      name: "X",
      icon: <XIcon />,
      color: "bg-black",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      color: "bg-[#1877F2]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      color: "bg-[#0077b5]",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: <Send size={20} />,
      color: "bg-[#0088cc]",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Messenger",
      icon: <MessengerIcon />,
      color: "bg-[#00B2FF]",
      url: `fb-messenger://share/?link=${encodedUrl}`,
    }, // Note: works best on mobile
  ];

  return (
    <div className="w-full max-w-sm p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20">
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-2xl">
              <Share2 className="text-blue-500" size={24} />
            </div>
          </div>
          <X onClick={onClose} className="cursor-pointer absolute right-0" />
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Share with friends
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {platforms.map((p) => (
          <div key={p.name} className="flex flex-col items-center gap-2 group">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-14 h-14 flex items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${p.color}`}
            >
              {p.icon}
            </a>

            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-wider">
              {p.name}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Copy
              size={18}
              className="text-slate-400 group-hover:text-blue-500"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
              {url}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
            }`}
          >
            {copied ? "COPIED" : "COPY"}
          </div>
        </button>

        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            className="w-full py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
          >
            More Options
          </button>
        )}
      </div>
    </div>
  );
};

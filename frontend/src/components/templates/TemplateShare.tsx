"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { SocialShare } from "@/components/shareSocial/ShareSocial";

export default function TemplateShare({
  url,
  title,
  className,
  style,
  ariaLabel,
  children,
}: {
  url: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={className}
        style={style}
        aria-label={ariaLabel || "Share"}
      >
        {children ?? <Share2 size={18} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SocialShare
              url={url}
              title={title}
              onClose={() => setOpen(false)}
              scenario="link"
            />
          </div>
        </div>
      )}
    </>
  );
}

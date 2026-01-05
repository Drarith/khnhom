"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProfileData } from "@/types/profileData";
import { Share2 } from "lucide-react";
import TemplateShare from "./TemplateShare";
import Footer from "../userProfile/Footer";
import Badge from "../badge/Badge";
import {
  SiTiktok,
  SiX,
  SiTelegram,
  SiInstagram,
  SiYoutube,
  SiGithub,
  SiFacebook,
} from "@icons-pack/react-simple-icons";

type SocialPlatform =
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "telegram"
  | "youtube"
  | "github";

export default function NeumorphismTemplate({ data }: { data: ProfileData }) {

  const theme = {
    bg: "#E0E5EC",
    text: "#4A5568",
    shadowLight: "rgba(255,255,255, 0.7)",
    shadowDark: "rgba(163,177,198,0.6)",
    border: "rgba(255,255,255,0.2)",
  };

  const neumorphicStyle = {
    background: theme.bg,
    boxShadow: `9px 9px 16px ${theme.shadowDark}, -9px -9px 16px ${theme.shadowLight}`,
    borderRadius: "20px",
    border: `1px solid ${theme.border}`,
  };

  const icons: Record<SocialPlatform, React.ReactElement> = {
    facebook: <SiFacebook className="w-6 h-6" />,
    x: <SiX className="w-6 h-6" />,
    instagram: <SiInstagram className="w-6 h-6" />,
    tiktok: <SiTiktok className="w-6 h-6" />,
    telegram: <SiTelegram className="w-6 h-6" />,
    youtube: <SiYoutube className="w-6 h-6" />,
    github: <SiGithub className="w-6 h-6" />,
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col relative md:shadow-2xl md:rounded-2xl md:overflow-hidden transition-colors duration-300 font-sans"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto p-6 min-h-screen">

        {/* Profile Picture */}
        <div
          className="p-1 rounded-full mb-8 flex items-center justify-center"
          style={{
            ...neumorphicStyle,
            borderRadius: "50%",
            width: "160px",
            height: "160px",
          }}
        >
          <div
            className="relative w-36 h-36 rounded-full overflow-hidden border-4"
            style={{ borderColor: theme.bg }}
          >
            {data.profilePictureUrl &&<Image
              src={data.profilePictureUrl}
              alt={data.username}
              fill
              className="object-cover"
              priority
            />}
          </div>
        </div>

        {/* Name & Bio */}
        <div className="text-center mb-10 space-y-3">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {data.displayName}
            </h1>
            <Badge
              username={data.username}
              isSupporter={data.isSupporter}
              isGoldSupporter={data.isGoldSupporter}
              isVerified={data.isVerified}
              isDev={data.isDev}
            />
          </div>
          {data.bio && (
            <p className="text-base mt-2 max-w-xs mx-auto leading-relaxed opacity-80">
              {data.bio}
            </p>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {Object.entries(data.socials)
            .filter(([_, v]) => v !== "")
            .map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 transition-transform active:scale-90 hover:-translate-y-1"
                style={{ ...neumorphicStyle, borderRadius: "50%" }}
              >
                {icons[key as SocialPlatform]}
              </a>
            ))}
        </div>

        {/* Links */}
        <div className="w-full space-y-6 mb-12">
          {data.links.map((link) => (
            <div key={link._id} className="relative group">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-5 text-center font-bold text-lg transition-all duration-300 active:scale-[0.97] hover:-translate-y-[2px]"
                style={neumorphicStyle}
              >
                {link.title}
              </a>
              <TemplateShare
                url={link.url}
                title={link.title}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 transition-colors"
                ariaLabel="Share link"
              >
                <Share2 size={18} className="opacity-60" />
              </TemplateShare>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto w-full">
          <Footer theme={{ text: theme.text }} username={data.username} />
        </div>
      </div>
    </div>
  );
}

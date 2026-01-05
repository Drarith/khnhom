import {
  SiTiktok,
  SiX,
  SiTelegram,
  SiInstagram,
  SiYoutube,
  SiGithub,
  SiFacebook,
} from "@icons-pack/react-simple-icons";

export const SOCIAL_PLATFORMS = [
  {
    key: "telegram",
    label: "Telegram",
    prefix: "https://t.me/",
    svg: <SiTelegram width={20} height={20} color="#0088cc" />,
  },
  {
    key: "x",
    label: "X (Twitter)",
    prefix: "https://x.com/",
    svg: <SiX width={20} height={20} color="#181717" />,
  },
  {
    key: "instagram",
    label: "Instagram",
    prefix: "https://instagram.com/",
    svg: <SiInstagram width={20} height={20} color="#E1306C" />,
  },
  {
    key: "github",
    label: "GitHub",
    prefix: "https://github.com/",
    svg: <SiGithub width={20} height={20} color="#181717" />,
  },
  {
    key: "tiktok",
    label: "TikTok",
    prefix: "https://tiktok.com/@",
    svg: <SiTiktok width={20} height={20} color="#000000" />,
  },
  {
    key: "youtube",
    label: "YouTube",
    prefix: "https://youtube.com/",
    svg: <SiYoutube width={20} height={20} color="#FF0000" />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    prefix: "https://www.linkedin.com/in/",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#0077B5" />
        <path
          d="M7 17V9h3v8H7zm1.5-9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5.5 9v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4h-3V9h3v1.5c.44-.77 1.5-1.5 2.5-1.5 1.93 0 3.5 1.57 3.5 3.5V17h-3z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    prefix: "https://facebook.com/",
    svg: <SiFacebook width={20} height={20} color="#1877F2" />,
  },
] as const;

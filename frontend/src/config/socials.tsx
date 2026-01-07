import {
  SiTiktok,
  SiX,
  SiTelegram,
  SiInstagram,
  SiYoutube,
  SiGithub,
  SiFacebook,
} from "@icons-pack/react-simple-icons";
import { LinkedInIcon } from "@/components/shareSocial/LinkedInIcon";

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
    svg: <LinkedInIcon />,
  },
  {
    key: "facebook",
    label: "Facebook",
    prefix: "https://facebook.com/",
    svg: <SiFacebook width={20} height={20} color="#1877F2" />,
  },
] as const;

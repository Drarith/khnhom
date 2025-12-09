import { ProfileData } from "@/types/profileData";
import { themes } from "@/config/theme";
import Image from "next/image";
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

export default function UserProfile({ data }: { data: ProfileData }) {
  const activeTheme = themes.find((theme) => {
    return theme.name === data.theme;
  });
  const icons: Record<SocialPlatform, React.ReactElement> = {
    facebook: <SiFacebook color={activeTheme?.text} />,
    x: <SiX color={activeTheme?.text} />,
    instagram: <SiInstagram color={activeTheme?.text} />,
    tiktok: <SiTiktok color={activeTheme?.text} />,
    telegram: <SiTelegram color={activeTheme?.text} />,
    youtube: <SiYoutube color={activeTheme?.text} />,
    github: <SiGithub color={activeTheme?.text} />,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: activeTheme?.bg , color: activeTheme?.text}}>
      <div className="relative w-full">
        <div className="relative w-full h-96 md:h-[500px]">
          <Image
            src={data.profilePictureUrl}
            alt="profile picture"
            fill
            className="object-cover"
            priority
          />
        </div>

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
      </div>

      <div className="relative -mt-20 px-4">
        <h1 className="text-2xl font-bold text-center" >{data.displayName}</h1>
        <div className="flex flex-row gap-2 justify-center">
          {/* filter and map */}
          {Object.entries(data?.socials)
            .filter(([_, v]) => v !== "")
            .map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                {icons[key as SocialPlatform]}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

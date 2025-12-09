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
  | "github"

export default function UserProfile({ data }: { data: ProfileData }) {
  const activeTheme = themes.find((theme) => {
    return theme.name === data.theme;
  });
  const icons: Record<SocialPlatform, React.ReactElement> = {
    facebook: <SiFacebook className="w-6 h-6" color={activeTheme?.text} />,
    x: <SiX className="w-6 h-6" color={activeTheme?.text} />,
    instagram: <SiInstagram className="w-6 h-6" color={activeTheme?.text} />,
    tiktok: <SiTiktok className="w-6 h-6" color={activeTheme?.text} />,
    telegram: <SiTelegram className="w-6 h-6" color={activeTheme?.text} />,
    youtube: <SiYoutube className="w-6 h-6" color={activeTheme?.text} />,
    github: <SiGithub className="w-6 h-6" color={activeTheme?.text} />,
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: activeTheme?.bg, color: activeTheme?.text }}
    >
      <div className="relative w-full shrink-0">
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

      <div className="relative -mt-20 px-4 pb-12 grow flex flex-col items-center max-w-2xl mx-auto w-full space-y-8 z-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm">
            {data.displayName}
          </h1>
          {data.bio && (
            <p className="text-lg opacity-90 max-w-lg mx-auto leading-relaxed font-medium">
              {data.bio}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(data?.socials)
            .filter(([_, v]) => v !== "")
            .map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full transition-transform hover:scale-110 hover:bg-white/10"
                aria-label={key}
              >
                {icons[key as SocialPlatform]}
              </a>
            ))}
        </div>

        {data.links && data.links.length > 0 && (
          <div className="w-full space-y-4 mt-4">
            {data.links.map((link) => (
              <a
                key={link._id}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal"
                style={{
                  backgroundColor: activeTheme?.button,
                  color: activeTheme?.buttonText,
                  borderColor: activeTheme?.buttonText,
                  boxShadow: `8px 8px 0px 0px ${activeTheme?.text || "#000"}`,
                }}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

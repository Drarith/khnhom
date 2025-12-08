import { ProfileData } from "@/types/profileData";
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

const icons: Record<SocialPlatform, React.ReactElement> = {
  facebook: <SiFacebook color="black" />,
  x: <SiX color="black" />,
  instagram: <SiInstagram color="black" />,
  tiktok: <SiTiktok color="black" />,
  telegram: <SiTelegram color="black" />,
  youtube: <SiYoutube color="black" />,
  github: <SiGithub color="black" />,
};

export default function UserProfile({ data }: { data: ProfileData }) {
  return (
    <div className="min-h-screen bg-primary">
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

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
      </div>

      <div className="relative -mt-20 px-4">
        <h1 className="text-2xl font-bold text-center">{data.displayName}</h1>
        <div className="flex flex-row gap-2 justify-center">
          {/* filter and map */}
          {Object.entries(data.socials)
            .filter(([_k, v]) => v !== "")
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

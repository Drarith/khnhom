import SocialMediaForm from "../../createProfile/socialMediaForm";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormEditorInputValues } from "@/types/profileForm/profileFormInput";

interface SocialsTabProps {
  socials: Record<string, string>;
  setValue: UseFormSetValue<ProfileFormEditorInputValues>;
}

export default function SocialsTab({ socials, setValue }: SocialsTabProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">
          Social Links
        </h2>
        <p className="text-sm text-primary/60">
          Connect your social media accounts
        </p>
      </div>

      <SocialMediaForm socials={socials} setValue={setValue} />
    </div>
  );
}

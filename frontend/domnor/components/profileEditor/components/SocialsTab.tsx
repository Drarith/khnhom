import SocialMediaForm from "../../createProfile/socialMediaForm";
import type { SocialsTabProps } from "@/types/tabProps";
import { useTranslations } from "next-intl";

export default function SocialsTab({ socials, setValue }: SocialsTabProps) {
  const t = useTranslations("profileEditor.socialsTab");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">
          {t("title")}
        </h2>
        <p className="text-sm text-primary/60">
          {t("description")}
        </p>
      </div>

      <SocialMediaForm socials={socials} setValue={setValue} />
    </div>
  );
}

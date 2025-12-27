import { ProfileData } from "@/types/profileData";
import { templates } from "@/registry/templateRegistry";
import { themes } from "@/config/theme";
import ProfileModals from "./ProfileModals";

export default function UserProfile({ data }: { data: ProfileData }) {

  const templateKey = data.selectedTemplate || "default";
  const TemplateComponent =
    templates[templateKey]?.component || templates.default.component;

  const activeTheme = themes.find((theme) => theme.name === data.theme);

  return (
    <div className="min-h-screen flex justify-center overflow-x-hidden relative">
      <div className="w-full max-w-lg h-full min-h-screen md:py-10 relative">
        <div
          className="rounded-2xl"
          style={{ backgroundColor: activeTheme?.bg, color: activeTheme?.text }}
        >
          <TemplateComponent data={data} />
        </div>
        <ProfileModals data={data} activeTheme={activeTheme} />
      </div>
    </div>
  );
}

import { ProfileData } from "@/types/profileData";
import { templates } from "@/registry/templateRegistry";
import { themes } from "@/config/theme";

export default function UserProfile({ data }: { data: ProfileData }) {
  // Get the template based on selectedTemplate field
  const templateKey = data.selectedTemplate || "default";
  const TemplateComponent =
    templates[templateKey]?.component || templates.default.component;

  const activeTheme = themes.find((theme) => theme.name === data.theme);

  return (
    <div
      className="min-h-screen flex justify-center overflow-x-hidden"
      style={{ backgroundColor: activeTheme?.bg, color: activeTheme?.text }}
    >
      <div className="w-full max-w-md h-full min-h-screen md:py-10">
        <TemplateComponent data={data} />
      </div>
    </div>
  );
}

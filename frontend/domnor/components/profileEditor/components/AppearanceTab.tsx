import type { ProfileData } from "@/types/profileData";
import ThemeCard from "@/components/themeCard/ThemeCard";
import { themes } from "@/config/theme";
import { UseFormSetValue } from "react-hook-form";
import { profileFormEditorInputSchema } from "@/validationSchema/inputValidationSchema";
import { z } from "zod";

type ProfileFormEditorInputValues = z.infer<typeof profileFormEditorInputSchema>;

interface AppearanceTabProps {
  initialData?: ProfileData;
  theme: string;
  setValue: UseFormSetValue<ProfileFormEditorInputValues>;
}

export default function AppearanceTab({
  initialData,
  theme,
  setValue,
}: AppearanceTabProps) {
  function onSelect(themeName: string) {
    setValue("theme", themeName, { shouldValidate: true });
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">Appearance</h2>
        <p className="text-sm text-primary/60">
          Customize how your profile looks
        </p>
      </div>

      {/* Theme Color */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 justify-items-center">
        {themes.map((t) => {
          return (
            <ThemeCard
              key={t.name}
              theme={t}
              onThemeSelect={onSelect}
              isSelected={theme === t.name}
            />
          );
        })}
      </div>

      {/* Profile Status */}
      <div className="border-t border-primary/10 pt-6">
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
          <div>
            <h3 className="font-medium text-primary">Profile Status</h3>
            <p className="text-sm text-primary/60">
              {initialData?.isActive
                ? "Your profile is live"
                : "Your profile is hidden"}
            </p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              initialData?.isActive ? "bg-primary" : "bg-primary/30"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-foreground transition-transform ${
                initialData?.isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

import type { ProfileData } from "@/types/profileData";
import ThemeCard from "@/components/themeCard/ThemeCard";
import { themes } from "@/config/theme";
import { templates } from "@/registry/templateRegistry";
import { backgroundImages } from "@/config/background";
import { UseFormSetValue } from "react-hook-form";
import { profileFormEditorInputSchema } from "@/validationSchema/inputValidationSchema";
import { z } from "zod";
import Image from "next/image";

type ProfileFormEditorInputValues = z.infer<
  typeof profileFormEditorInputSchema
>;

interface AppearanceTabProps {
  initialData?: ProfileData;
  theme: string;
  selectedTemplate: string;
  backgroundImage: string;
  setValue: UseFormSetValue<ProfileFormEditorInputValues>;
}

export default function AppearanceTab({
  initialData,
  theme,
  selectedTemplate,
  backgroundImage,
  setValue,
}: AppearanceTabProps) {
  function onThemeSelect(themeName: string) {
    setValue("theme", themeName, { shouldValidate: true });
  }

  function onTemplateSelect(templateKey: string) {
    setValue("selectedTemplate", templateKey, { shouldValidate: true });
  }

  function onBackgroundSelect(backgroundName: string) {
    setValue("backgroundImage", backgroundName, { shouldValidate: true });
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">Appearance</h2>
        <p className="text-sm text-primary/60">
          Customize how your profile looks
        </p>
      </div>

      <div>
        <h3 className="font-medium text-primary mb-4">Template</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 justify-items-center text-foreground">
          <select
            value={selectedTemplate}
            onChange={(e) => onTemplateSelect(e.target.value)}
            className="w-full p-2 border border-primary/20 rounded-lg bg-background text-foreground"
          >
            {Object.entries(templates).map(([key, template]) => (
              <option key={key} value={key}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Theme Color */}
      <div>
        <h3 className="font-medium text-primary mb-4">Theme Color</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {themes.map((t) => {
            return (
              <ThemeCard
                key={t.name}
                theme={t}
                onThemeSelect={onThemeSelect}
                isSelected={theme === t.name}
              />
            );
          })}
        </div>
      </div>

      {/* Background Image */}
      <div>
        <h3 className="font-medium text-primary mb-4">Background Image</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => onBackgroundSelect("")}
            className={`relative h-32 rounded-lg border-2 transition-all overflow-hidden ${
              backgroundImage === ""
                ? "border-primary shadow-lg scale-105"
                : "border-primary/20 hover:border-primary/40"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
              <span className="text-sm font-medium text-primary">None</span>
            </div>
          </button>
          {backgroundImages.map((bg) => (
            <button
              type="button"
              key={bg.url}
              onClick={() => onBackgroundSelect(bg.name)}
              className={`relative h-32 rounded-lg border-2 transition-all overflow-hidden ${
                backgroundImage === bg.name
                  ? "border-primary shadow-lg scale-105"
                  : "border-primary/20 hover:border-primary/40"
              }`}
            >
              <Image src={bg.url} alt={bg.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                <span className="text-xs font-medium text-white drop-shadow">
                  {bg.name}
                </span>
              </div>
            </button>
          ))}
        </div>
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

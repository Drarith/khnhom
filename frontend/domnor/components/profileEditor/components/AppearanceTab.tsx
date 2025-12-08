import type { ProfileData } from "@/types/profileData";
import ThemeCard from "@/components/themeCard/ThemeCard";
import { themes } from "@/config/theme";

interface AppearanceTabProps {
  initialData?: ProfileData;
}

export default function AppearanceTab({ initialData }: AppearanceTabProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">Appearance</h2>
        <p className="text-sm text-primary/60">
          Customize how your profile looks
        </p>
      </div>

      {/* Template Selection */}
      <div>
        {/* <label className="block text-sm font-medium text-primary/70 mb-3">
          Profile Template
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["default", "minimal", "gradient", "dark", "modern", "classic"].map(
            (template) => (
              <button
                type="button"
                key={template}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  initialData?.selectedTemplate === template
                    ? "border-primary bg-primary/5"
                    : "border-primary/20 hover:border-primary/30"
                }`}
              >
                <div className="w-full h-24 bg-linear-to-br from-primary/10 to-primary/20 rounded mb-2"></div>
                <span className="text-sm font-medium capitalize text-primary">
                  {template}
                </span>
              </button>
            )
          )}
        </div> */}
      </div>

      {/* Theme Color */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 justify-items-center">
        {themes.map((theme) => {
          return <ThemeCard key={theme.name} theme={theme} />;
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

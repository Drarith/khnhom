import type { Theme } from "@/types/theme";

export default function ThemeCard({
  theme,
  onThemeSelect,
  isSelected, // Destructure isSelected prop
}: {
  theme: Theme;
  onThemeSelect: (themeName: string) => void;
  isSelected: boolean; // Add isSelected prop type
}) {
  return (
    <div>
      {/* Visual Preview */}
      <div
        className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-[1.02] w-38 md:w-55 ${
          isSelected ? "ring-2 ring-blue-500" : ""
        }`} // Add ring class if selected
        style={{ backgroundColor: theme.bg }}
      >
        {/* Profile Circle */}
        <div
          className="w-16 h-16 rounded-full mb-2"
          style={{ backgroundColor: theme.button }}
        ></div>

        {/* Profile Name Placeholder */}
        <div
          className="w-24 h-4 rounded-full opacity-80"
          style={{ backgroundColor: theme.text }}
        ></div>

        {/* Bio Placeholder */}
        <div
          className="w-32 h-2 rounded-full opacity-60 mb-2"
          style={{ backgroundColor: theme.text }}
        ></div>

        {/* Buttons */}
        <button
          type="button"
          className="w-full h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm"
          style={{
            backgroundColor: theme.button,
            color: theme.buttonText,
            // border: theme.border ? `1px solid ${theme.border}` : "none",
          }}
          onClick={() => {
            onThemeSelect(theme.name);
          }}
        >
          SELECT
        </button>
      </div>
    </div>
  );
}

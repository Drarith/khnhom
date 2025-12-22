import type { Theme } from "@/types/theme";
import "./themeCard.css";

export default function ThemeCard({
  theme,
  onThemeSelect,
  isSelected,
}: {
  theme: Theme;
  onThemeSelect: (themeName: string) => void;
  isSelected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onThemeSelect(theme.name)}
      className={`theme-btn for-background relative rounded-lg p-4 flex flex-col items-center justify-center gap-3 transition-all border-2 h-52 w-full${
        isSelected
          ? " shadow-lg selected-spin"
          : "border-primary/20 hover:border-primary/40 hover:scale-[1.02]"
      }`}
      style={{ background: theme.bg }}
    >
      {/* Profile Circle */}
      <div
        className="w-16 h-16 rounded-full mb-2"
        style={{ background: theme.button }}
      ></div>

      {/* Profile Name Placeholder */}
      <div
        className="w-24 h-4 rounded-full opacity-80"
        style={{ background: theme.text }}
      ></div>

      {/* Bio Placeholder */}
      <div
        className="w-32 h-2 rounded-full opacity-60 mb-2"
        style={{ background: theme.text }}
      ></div>

      {/* Button Preview */}
      <div
        className="w-full h-8 rounded-lg flex items-center justify-center text-xs font-semibold shadow-sm"
        style={{
          background: theme.button,
          color: theme.buttonText,
        }}
      >
        LINK
      </div>

      {/* Theme Name Label */}
      <div className="absolute bottom-2 left-2 right-2">
        <span
          className="text-xs font-medium drop-shadow px-2 py-1 rounded"
          style={{
            color: theme.text,
            backgroundColor: `${theme.bg}cc`,
          }}
        >
          {theme.name}
        </span>
      </div>
    </button>
  );
}

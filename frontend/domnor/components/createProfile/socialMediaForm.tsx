import { useState } from "react";
import { UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";
import { useTranslations } from "next-intl";

import { SOCIAL_PLATFORMS } from "@/config/socials";
import Button from "../ui/Button";

// Make the component generic
interface SocialMediaFormProps<T extends FieldValues> {
  socials: Record<string, string>;
  setValue: UseFormSetValue<T>;
}

export default function SocialMediaForm<T extends FieldValues>({
  socials,
  setValue,
}: SocialMediaFormProps<T>) {
  const [selected, setSelected] = useState<string>(SOCIAL_PLATFORMS[0].key);
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("profileSetupPage");
  const currentPlatform = SOCIAL_PLATFORMS.find((p) => p.key === selected);

  const handleAddSocial = () => {
    if (inputValue.trim().length >= 3) {
      const fullUrl = `${currentPlatform?.prefix}${inputValue.trim()}`;

      setValue(
        "socials" as Path<T>,
        {
          ...socials,
          [selected]: fullUrl,
        } as PathValue<T, Path<T>>,
        { shouldValidate: true }
      );
      setInputValue("");
    }
  };

  const handleRemoveSocial = (key: string) => {
    const newSocials = { ...socials };
    delete newSocials[key];

    setValue("socials" as Path<T>, newSocials as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
  };

  const isAlreadyAdded = selected in socials && socials[selected].trim() !== "";
  const isValidInput =
    inputValue.trim().length >= 3 && inputValue.trim().length <= 30;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-foreground p-4">
        <div className="flex items-center gap-3">
          {currentPlatform && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
              {currentPlatform.svg}
            </div>
          )}

          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 rounded-lg border border-primary/20 bg-foreground px-3 py-2 text-sm text-primary transition focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {SOCIAL_PLATFORMS.map((platform) => (
              <option key={platform.key} value={platform.key}>
                {platform.label} {socials[platform.key] ? "✓" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="flex w-full rounded-lg border border-primary/20 bg-foreground transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
            <span className="flex items-center border-r border-primary/10 bg-primary/5 px-3 py-2.5 text-sm text-primary/60">
              {currentPlatform?.prefix}
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (isValidInput && !isAlreadyAdded) {
                    handleAddSocial();
                  }
                }
              }}
              placeholder="username"
              className="flex-1 rounded-r-lg bg-transparent px-4 py-2.5 text-sm text-primary placeholder:text-primary/40 focus:outline-none"
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-primary/50">
              {inputValue.trim().length < 3 && inputValue.length > 0
                ? "Minimum 3 characters"
                : `Preview: ${currentPlatform?.prefix}${
                    inputValue || "username"
                  }`}
            </span>
            <span
              className={`${
                inputValue.length > 30 ? "text-red-500" : "text-primary/50"
              }`}
            >
              {inputValue.length}/30
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAddSocial}
          disabled={!isValidInput || isAlreadyAdded}
        >
          {isAlreadyAdded
            ? t("socialMediaInput.added")
            : t("socialMediaInput.addSocialLink")}
        </Button>
      </div>

      {/* Added Socials List */}
      {Object.keys(socials).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-primary/70">
            {t("socialMediaInput.addedSocialLink")} (
            {Object.keys(socials).length})
          </p>
          {Object.entries(socials).map(([key, url]) => {
            if (url.trim() === "") return null;
            const platform = SOCIAL_PLATFORMS.find((p) => p.key === key);
            return (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-primary/10 bg-foreground p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                    {platform?.svg}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-primary">
                      {platform?.label}
                    </span>
                    <span className="text-xs text-primary/60 truncate max-w-[200px] sm:max-w-xs">
                      {url}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(key)}
                  className="rounded-md p-1.5 text-primary/60 transition hover:bg-red-500/10 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  aria-label={`Remove ${platform?.label}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

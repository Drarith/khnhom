"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export const LanguageToggle = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (newLang: string) => {
    if (newLang === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: newLang });
    });
  };

  return (
    <div className="relative flex w-40 md:w-56 md:h-11 bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 select-none">
      {/* Animated Sliding Background */}
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-600 rounded-full shadow-sm transition-transform duration-300 ease-out will-change-transform  ${
          locale === "kh" ? "translate-x-0" : "translate-x-full"
        }`}
      />

      {/* Buttons */}
      <button
        onClick={() => handleToggle("kh")}
        disabled={isPending}
        className={`relative z-10 flex-1 text-sm font-semibold transition-colors duration-200 cursor-pointer  ${
          locale === "kh" ? "text-zinc-900 dark:text-white" : "text-zinc-500"
        } disabled:opacity-50`}
      >
        ភាសាខ្មែរ
      </button>

      <button
        onClick={() => handleToggle("en")}
        disabled={isPending}
        className={`relative z-10 flex-1 text-sm font-semibold transition-colors duration-200 cursor-pointer  ${
          locale === "en" ? "text-zinc-900 dark:text-white" : "text-zinc-500"
        } disabled:opacity-50`}
      >
        English
      </button>
    </div>
  );
};

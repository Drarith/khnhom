export type LocaleCode = "en" | "kh";

export const locales: readonly LocaleCode[] = ["en", "kh"] as const;

export type Locale = { locale: LocaleCode };

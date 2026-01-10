import { defineRouting } from "next-intl/routing";
import { locales } from "@/types/locale.types";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",
});

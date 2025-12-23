import { z } from "zod";

const ALLOWED_SOCIAL_KEYS = new Set([
  "x",
  "instagram",
  "github",
  "telegram",
  "tiktok",
  "youtube",
  "linkedin",
  "facebook",
]);

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

export const SanitizedString = (
  maxLength: number,
  minLength = 0,
  pattern?: RegExp,
  patternMessage?: string,
  minMessage?: string,
  maxMessage?: string
) => {
  // Start with string and trim first
  let schema: z.ZodTypeAny = z
    .string()
    .default("")
    .transform((s) => s.trim());

  // Then apply length validations
  // we use pipe() to chain validations
  if (minLength > 0) {
    schema = schema.pipe(
      z.string().min(minLength, {
        message: minMessage || `Must be at least ${minLength} characters`,
      })
    );
  }

  schema = schema.pipe(
    z.string().max(maxLength, {
      message: maxMessage || `Must be at most ${maxLength} characters`,
    })
  );

  // Then apply pattern validation
  if (pattern) {
    schema = schema.pipe(
      z.string().regex(pattern, {
        message: patternMessage || "Invalid format",
      })
    );
  }

  // Finally apply sanitization transformations
  return schema
    .transform((s) => normalizeWhitespace(s as string))
    .transform((s) => escapeHtml(s));
};
export const SocialsSchema = z
  .record(z.string(), z.unknown())
  .default({})
  .transform((raw) => {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      // if key not in allowed keys, skip
      if (!ALLOWED_SOCIAL_KEYS.has(key)) continue;
      if (typeof value === "string" && value.trim() !== "") {
        const trimmed = value.trim();
        // If it's a valid HTTPS URL, use it as-is
        if (isValidHttpUrl(trimmed)) {
          out[key] = trimmed;
        } else {
          // Otherwise, it's a handle/username - sanitize and cap at 100 chars
          out[key] = escapeHtml(normalizeWhitespace(trimmed)).slice(0, 100);
        }
      }
    }
    return out;
  });

export function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export const SanitizedUrl = (errorMessage?: string) => {
  return z
    .string()
    .trim()
    .refine((val) => val === "" || isValidHttpUrl(val), {
      message:
        errorMessage ||
        "Must be a valid HTTPS URL. Example: https://domnor.com",
    })
    .transform((val) => (isValidHttpUrl(val) ? val : ""))
    .default("");
};

// Factory function to create schema with translations
export const createProfileFormInputSchema = (
  t: (key: string, values?: Record<string, string | number>) => string
) => {
  return z.object({
    username: SanitizedString(
      30,
      3,
      /^[a-zA-Z0-9_]+$/,
      t("validation.usernamePattern"),
      t("validation.minLength", { min: 3 }),
      t("validation.maxLength", { max: 30 })
    ),
    displayName: SanitizedString(
      30,
      3,
      undefined,
      undefined,
      t("validation.minLength", { min: 3 }),
      t("validation.maxLength", { max: 30 })
    ),
    bio: SanitizedString(
      1000,
      0,
      undefined,
      undefined,
      undefined,
      t("validation.maxLength", { max: 1000 })
    ),
    socials: SocialsSchema,
    link: SanitizedUrl(t("validation.invalidUrl")),
    theme: SanitizedString(50),
  });
};

export const editProfileFormInputSchema = (
  t: (key: string, values?: Record<string, string | number>) => string
) => {
  return z.object({
    displayName: SanitizedString(
      30,
      3,
      undefined,
      undefined,
      t("validation.minLength", { min: 3 }),
      t("validation.maxLength", { max: 30 })
    ),
    bio: SanitizedString(
      1000,
      0,
      undefined,
      undefined,
      undefined,
      t("validation.maxLength", { max: 1000 })
    ),
    socials: SocialsSchema,
    link: SocialsSchema,
  });
};

// Default schema without translations (for backwards compatibility)
export const profileFormInputSchema = z.object({
  username: SanitizedString(
    30,
    3,
    /^[a-zA-Z0-9_]+$/,
    "Username can contain only letters, numbers and underscores"
  ),
  displayName: SanitizedString(30, 3),
  bio: SanitizedString(1000),
  socials: SocialsSchema,
  link: SanitizedUrl(),
});

export const profileFormEditorInputSchema = z.object({
  displayName: SanitizedString(30, 3),
  bio: SanitizedString(1000),
  socials: SocialsSchema,
  theme: SanitizedString(50),
  selectedTemplate: z.enum(["default", "brutalist", "retro", "minimalism", "glassmorphism", "editorial", "neobrutalism", "khmerroyal"]).optional(),
  backgroundImage: z.string().optional(),
});

export const linkFormEditorInputSchema = z.object({
  link: z
    .object({
      title: SanitizedString(30, 3),
      url: SanitizedUrl(),
    })
    .refine(
      (data) => {
        const hasTitle = data.title.length > 3;
        const hasUrl = data.url.length > 8;
        return hasTitle && hasUrl;
      },
      {
        message: "Must have both title and valid URL.",
        path: ["link"],
      }
    ),
});

export const socialHandleInputSchema = z.object({
  socialHandle: SanitizedString(30, 3),
});

// Base KHQR Schema
const baseKhqrSchema = z.object({
  accountType: z.enum(["individual", "merchant"]),
  bakongAccountID: z.string().min(1, "Bakong Account ID is required").max(32),
  merchantName: z
    .string()
    .min(3, "Merchant name must be at least 3 characters")
    .max(25),
  currency: z.enum(["KHR", "USD"]).optional(),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
      "Invalid amount format"
    ),
  merchantCity: z.string().max(15).optional(),
  // billNumber: z.string().max(25).optional(),
  // mobileNumber: z.string().max(25).optional(),
  // storeLabel: z.string().max(25).optional(),
  // terminalLabel: z.string().max(25).optional(),
  // purposeOfTransaction: z.string().max(25).optional(),
  // upiAccountInformation: z.string().max(31).optional(),
  // merchantAlternateLanguagePreference: z.string().max(2).optional(),
  // merchantNameAlternateLanguage: z.string().max(25).optional(),
  // merchantCityAlternateLanguage: z.string().max(15).optional(),
});

// Individual specific fields
const individualKhqrSchema = baseKhqrSchema.extend({
  accountType: z.literal("individual"),
  accountInformation: z.string().max(32).optional(),
  acquiringBank: z.string().max(32).optional(),
});

// Merchant specific fields
const merchantKhqrSchema = baseKhqrSchema.extend({
  accountType: z.literal("merchant"),
  merchantID: z.string().min(1, "Merchant ID is required").max(32),
  acquiringBank: z.string().min(1, "Acquiring Bank is required").max(32),
});

// Combined schema
export const khqrFormEditorInputSchema = z.discriminatedUnion("accountType", [
  individualKhqrSchema,
  merchantKhqrSchema,
]);

// Individual KHQR Schema
// export const khqrIndividualFormSchema = z.object({
//   accountType: z.literal("individual"),
//   bakongAccountID: z.string().min(1, "Bakong Account ID is required").max(32),
//   merchantName: z
//     .string()
//     .min(3, "Merchant name must be at least 3 characters")
//     .max(25),
//   accountInformation: z.string().max(32).optional(),
//   acquiringBank: z.string().max(32).optional(),
//   currency: z.enum(["KHR", "USD"]).optional().default("KHR"),
//   amount: z
//     .string()
//     .optional()
//     .refine(
//       (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
//       "Invalid amount format"
//     ),
//   merchantCity: z.string().max(15).optional(),
//   billNumber: z.string().max(25).optional(),
//   mobileNumber: z.string().max(25).optional(),
//   storeLabel: z.string().max(25).optional(),
//   terminalLabel: z.string().max(25).optional(),
//   purposeOfTransaction: z.string().max(25).optional(),
//   upiAccountInformation: z.string().max(31).optional(),
//   merchantAlternateLanguagePreference: z.string().max(2).optional(),
//   merchantNameAlternateLanguage: z.string().max(25).optional(),
//   merchantCityAlternateLanguage: z.string().max(15).optional(),
// });

// // Merchant KHQR Schema
// export const khqrMerchantFormSchema = z.object({
//   accountType: z.literal("merchant"),
//   bakongAccountID: z.string().min(1, "Bakong Account ID is required").max(32),
//   merchantName: z
//     .string()
//     .min(3, "Merchant name must be at least 3 characters")
//     .max(25),
//   merchantID: z.string().min(1, "Merchant ID is required").max(32),
//   acquiringBank: z.string().min(1, "Acquiring Bank is required").max(32),
//   currency: z.enum(["KHR", "USD"]).optional().default("KHR"),
//   amount: z
//     .string()
//     .optional()
//     .refine(
//       (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
//       "Invalid amount format"
//     ),
//   merchantCity: z.string().max(15).optional(),
//   billNumber: z.string().max(25).optional(),
//   mobileNumber: z.string().max(25).optional(),
//   storeLabel: z.string().max(25).optional(),
//   terminalLabel: z.string().max(25).optional(),
//   purposeOfTransaction: z.string().max(25).optional(),
//   upiAccountInformation: z.string().max(31).optional(),
//   merchantAlternateLanguagePreference: z.string().max(2).optional(),
//   merchantNameAlternateLanguage: z.string().max(25).optional(),
//   merchantCityAlternateLanguage: z.string().max(15).optional(),
// });

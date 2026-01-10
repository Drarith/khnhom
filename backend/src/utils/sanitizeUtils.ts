import { z } from "zod";
import { Filter } from "bad-words";
import type { ProfileCreationInput } from "../types/user-input.types.js";

const filter = new Filter();

export function containsBadWords(str: string): boolean {
  try {
    return filter.isProfane(str);
  } catch (e) {
    return false;
  }
}

export function cleanBadWords(str: string): string {
  try {
    return filter.clean(str);
  } catch (e) {
    return str;
  }
}

// Escape HTML special characters to prevent XSS
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Normalize whitespace (remove extra spaces, trim)
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

// Validate only http/https URLs
export function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Sanitized string — trims, normalizes, escapes, validates no bad words, and caps length
export const SanitizedString = (maxLength: number) =>
  z
    .string()
    .default("")
    .transform((s) => normalizeWhitespace(s))
    .transform((s) => s.trim())
    .refine((s) => !containsBadWords(s), {
      message: "Input contains inappropriate language",
    })
    .transform((s) => escapeHtml(s))
    .transform((s) => s.slice(0, maxLength));

// Sanitized string no HTML escaping, depending on frontend otherwise we will try to escape khmer characters.
export const SanitizedUnicodeString = (maxLength: number) =>
  z
    .string()
    .default("")
    .transform((s) => normalizeWhitespace(s))
    .transform((s) => s.trim())
    .refine((s) => !containsBadWords(s), {
      message: "Input contains inappropriate language",
    })
    .transform((s) => s.slice(0, maxLength));

// Strictly valid HTTP/S URL (fails if invalid)
export const ValidHttpUrl = () =>
  z
    .string()
    .trim()
    .refine(isValidHttpUrl, { message: "Invalid HTTP/S URL" })
    .optional()
    .default("");

// Safe URL. replaces invalid URLs with empty string
export const SanitizedUrl = () =>
  z
    .string()
    .trim()
    .transform((val) => (isValidHttpUrl(val) ? val : ""))
    .default("");

// not utilized currently but may be useful in future
export const SanitizedListOfUrls = () =>
  z
    .array(
      z.object({
        url: SanitizedUrl(),
        title: SanitizedString(300),
        description: SanitizedString(300).optional(),
      })
    )
    .transform((arr) => arr.filter((item) => (item.url || "").trim() !== ""));

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

export const SocialsSchema = z
  .record(z.string(), z.unknown())
  .default({})
  .transform((raw) => {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (!ALLOWED_SOCIAL_KEYS.has(key)) continue;
      if (typeof value === "string" && value.trim() !== "") {
        const trimmed = value.trim();
        const sanitizedUrl = SanitizedUrl().parse(trimmed);
        if (sanitizedUrl && sanitizedUrl.trim() !== "") {
          out[key] = sanitizedUrl;
        } else {
          // For non-URL socials, validate no bad words then escape and cap length
          const normalized = normalizeWhitespace(trimmed);
          if (containsBadWords(normalized)) {
            throw new Error(
              `Social link for ${key} contains inappropriate language`
            );
          }
          out[key] = escapeHtml(normalized.slice(0, 100));
        }
      }
    }
    return out;
  });

// Sanitize link separately because link is an object
export const CreateProfileSchema = z.object({
  user: z.string(),
  username: SanitizedString(30),
  displayName: SanitizedUnicodeString(50),
  bio: SanitizedUnicodeString(1000),
  profilePictureUrl: SanitizedUrl(),
  paymentQrCodeUrl: SanitizedUrl(),
  socials: SocialsSchema,
  theme: SanitizedString(50),
});

export type SanitizedCreateProfile = z.infer<typeof CreateProfileSchema>;

export function sanitizeCreateProfile(
  input: ProfileCreationInput
): SanitizedCreateProfile {
  const result = CreateProfileSchema.safeParse(input);
  if (!result.success) {
    // Log details for debugging and throw a clear error the controller can map to 400
    console.error("Validation failed:", result.error.flatten());
    throw new Error("Invalid profile data");
  }
  return result.data;
}

export const invidualKHQR = z.object({
  bakongAccountId: SanitizedString(32),
  name: SanitizedString(25),
  amount: z
    .string()
    .regex(/^[0-9]+$/, "Account ID must contain only numbers")
    .optional(),
  currency: z.enum(["KHR", "USD"]),
  mobileNumber: z
    .string()
    .max(25, "Phone number can only contain less than 25 numbers.")
    .regex(/^[0-9]+$/, "Account ID must contain only numbers")
    .optional(),
  storeLabel: SanitizedString(25),
  purposeOfTransaction: SanitizedString(25),
});

export const merchanKHQR = z.object({
  bakongAccountId: SanitizedString(32),
  name: SanitizedString(25),
  amount: z
    .string()
    .regex(/^[0-9]+$/, "Account ID must contain only numbers")
    .optional(),
  currency: z.enum(["KHR", "USD"]),
  mobileNumber: z
    .string()
    .max(25, "Phone number can only contain less than 25 numbers.")
    .regex(/^[0-9]+$/, "Account ID must contain only numbers")
    .optional(),
  storeLabel: SanitizedString(25),
  purposeOfTransaction: SanitizedString(25),
});

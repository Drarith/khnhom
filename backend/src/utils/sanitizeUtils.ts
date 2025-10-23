import { z } from "zod";

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

// Sanitized string — trims, normalizes, escapes, and caps length
export const SanitizedString = (maxLength: number) =>
  z
    .string()
    .default("")
    .transform((s) => normalizeWhitespace(s))
    .transform((s) => s.slice(0, maxLength))
    .transform((s) => escapeHtml(s));

// Strictly valid HTTP/S URL (fails if invalid)
export const ValidHttpUrl = () =>
  z
    .string()
    .trim()
    .refine(isValidHttpUrl, { message: "Invalid HTTP/S URL" })
    .optional()
    .default("");

// Safe URL — replaces invalid URLs with empty string
export const SanitizedUrl = () =>
  z
    .string()
    .trim()
    .transform((val) => (isValidHttpUrl(val) ? val : ""))
    .default("");


const ALLOWED_SOCIAL_KEYS = new Set([
  "twitter",
  "instagram",
  "github",
  "website",
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
        if (isValidHttpUrl(trimmed)) {
          out[key] = trimmed;
        } else {
          out[key] = escapeHtml(normalizeWhitespace(trimmed).slice(0, 100));
        }
      }
    }
    return out;
  });


export const CreateProfileSchema = z.object({
  username: SanitizedString(30),
  displayName: SanitizedString(30),
  bio: SanitizedString(1000),
  profilePictureUrl: SanitizedUrl(),
  paymentQrCodeUrl: SanitizedUrl(),
  socials: SocialsSchema,
  theme: SanitizedString(50),
});

export type SanitizedCreateProfile = z.infer<typeof CreateProfileSchema>;



export function sanitizeCreateProfile(
  input: Record<string, unknown>
): SanitizedCreateProfile {
  const result = CreateProfileSchema.safeParse(input);
  if (!result.success) {
    console.error("Validation failed:", result.error.flatten());
    // Parse empty to apply defaults safely
    return CreateProfileSchema.parse({});
  }
  return result.data;
}

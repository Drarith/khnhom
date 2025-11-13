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
  patternMessage?: string
) => {
  let schema = z.string();

  if (minLength > 0) {
    schema = schema.min(minLength, {
      message: `Must be at least ${minLength} characters`,
    });
  }

  schema = schema.max(maxLength, {
    message: `Must be at most ${maxLength} characters`,
  });

  if (pattern) {
    schema = schema.regex(pattern, {
      message: patternMessage || "Invalid format",
    });
  }

  return schema
    .default("")
    .transform((s) => normalizeWhitespace(s))
    .transform((s) => s.trim())
    .transform((s) => escapeHtml(s))
    .transform((s) => s.slice(0, maxLength));
};

export const SocialsSchema = z
  .record(z.string(), z.unknown())
  .default({})
  .transform((raw) => {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (!ALLOWED_SOCIAL_KEYS.has(key)) continue;
      if (typeof value === "string" && value.trim() !== "") {
        const trimmed = value.trim();
        if (SanitizedUrl().parse(trimmed)) {
          out[key] = trimmed;
        } else {
          out[key] = escapeHtml(normalizeWhitespace(trimmed).slice(0, 100));
        }
      }
    }
    return out;
  });

export function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const SanitizedUrl = () =>
  z
    .string()
    .trim()
    .transform((val) => (isValidHttpUrl(val) ? val : ""))
    .default("");

// Use explicit min for username/displayName (3), keep max same as before
export const profileFormInputSchema = z.object({
  username: SanitizedString(
    30,
    3,
    /^[a-zA-Z0-9_]+$/,
    "Username can contain only letters, numbers and underscores"
  ),
  displayName: SanitizedString(30, 3),
  bio: SanitizedString(1000),
  profilePictureUrl: SanitizedUrl(),
  paymentQrCodeUrl: SanitizedUrl(),
  socials: SocialsSchema,
  theme: SanitizedString(50),
});

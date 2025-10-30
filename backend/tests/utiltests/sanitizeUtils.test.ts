import { describe, it, expect } from "vitest";
import {
  sanitizeCreateProfile,
  SanitizedUrl,
  SanitizedString,
} from "../../src/utils/sanitizeUtils.js";
import type { SanitizedCreateProfile } from "../../src/utils/sanitizeUtils.js";

describe("sanitizeCreateProfile", () => {
  it("trims, normalizes whitespace, escapes HTML and caps length", () => {
    const input: any = {
      user: "123e4567-e89b-12d3-a456-426614174000",
      username: "   foo   <script>alert(1)</script>   ",
      displayName: "  A   B   ",
      bio: "   Hello   world   ",
      theme: "<b>my-theme</b>",
    };

    const out = sanitizeCreateProfile(input) as SanitizedCreateProfile;

    // username trimmed, whitespace normalized and HTML escaped
    expect(out.username).toBe("foo &lt;script&gt;alert(1)&lt;");
    // displayName whitespace normalized
    expect(out.displayName).toBe("A B");
    // bio trimmed & normalized
    expect(out.bio).toBe("Hello world");
    // theme escaped
    expect(out.theme).toBe("&lt;b&gt;my-theme&lt;/b&gt;");
  });

  it("validates and normalizes URLs: valid http(s) preserved, invalid -> empty string", () => {
    const input: any = {
      user: "123e4567-e89b-12d3-a456-426614174000",
      username: "okuser",
      displayName: "OK User",
      profilePictureUrl: "  https://example.com/avatar.png  ",
      paymentQrCodeUrl: "not-a-url",
    };

    const out = sanitizeCreateProfile(input) as SanitizedCreateProfile;

    expect(out.profilePictureUrl).toBe("https://example.com/avatar.png");
    // invalid URL should become empty string (SanitizedUrl -> "" default)
    expect(out.paymentQrCodeUrl).toBe("");
  });

  it("keeps only allowed social keys and normalizes/escapes values", () => {
    const input: any = {
      user: "123e4567-e89b-12d3-a456-426614174000",
      username: "socialuser",
      displayName: "Social User",
      socials: {
        x: "  https://x.com/test  ",
        github: "<img src=x onerror=alert(1)>",
        notAllowedKey: "shouldNotAppear",
      },
    };

    const out = sanitizeCreateProfile(input) as SanitizedCreateProfile;

    // x was a valid URL, kept and trimmed
    expect(out.socials.x).toBe("https://x.com/test");
    // github was not a URL; it should be escaped and normalized
    expect(out.socials.github).toBe("&lt;img src=x onerror=alert(1)&gt;");
    // disallowed key should be absent
    expect(
      (out.socials as Record<string, string>).notAllowedKey
    ).toBeUndefined();
  });

  it("applies defaults for optional fields when omitted", () => {
    const input: any = {
      user: "123e4567-e89b-12d3-a456-426614174000",
      username: "defaults",
      displayName: "Defaults",
    };

    const out = sanitizeCreateProfile(input) as SanitizedCreateProfile;

    expect(out.bio).toBeDefined();
    expect(out.profilePictureUrl).toBeDefined();
    expect(out.paymentQrCodeUrl).toBeDefined();
    expect(out.socials).toBeDefined();
    // theme should default to empty string
    expect(out.theme).toBeDefined();
  });

 
  it("SanitizedUrl: returns trimmed url for valid input and empty string for invalid input", () => {
    const valid = SanitizedUrl().parse("  https://example.com/path  ");
    expect(valid).toBe("https://example.com/path");

    const invalid = SanitizedUrl().parse("notaurl");
  
    expect(invalid).toBe("");
  });

  it("SanitizedString: trims, normalizes whitespace and escapes HTML and caps length", () => {
    const s = SanitizedString(10).parse(
      "   <b>Hello   <script>bad</script>   "
    );
   
    expect(s).toContain("&lt;");
    expect(s.length).toBeLessThanOrEqual(10);
  });

  it("controller-like behavior: reject empty sanitized URL (should be treated as invalid)", () => {
    const raw = "not-a-valid-url";
    const safe = SanitizedUrl().parse(raw);
 
    expect(safe).toBe("");
  });
});

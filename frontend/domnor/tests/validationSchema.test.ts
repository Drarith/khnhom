import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  normalizeWhitespace,
  SanitizedString,
  SanitizedUrl,
  SocialsSchema,
  isValidHttpUrl,
  profileFormInputSchema,
} from "@/validationSchema/inputValidationSchema";

describe("inputValidationSchema", () => {
  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
      );
      expect(escapeHtml('Test & "quotes"')).toBe("Test &amp; &quot;quotes&quot;");
      expect(escapeHtml("<div>test</div>")).toBe("&lt;div&gt;test&lt;/div&gt;");
    });

    it("should handle strings without special characters", () => {
      expect(escapeHtml("hello world")).toBe("hello world");
      expect(escapeHtml("123456")).toBe("123456");
    });
  });

  describe("normalizeWhitespace", () => {
    it("should normalize multiple spaces to single space", () => {
      expect(normalizeWhitespace("hello  world")).toBe("hello world");
      expect(normalizeWhitespace("hello   world")).toBe("hello world");
      expect(normalizeWhitespace("hello    world")).toBe("hello world");
    });

    it("should trim leading and trailing whitespace", () => {
      expect(normalizeWhitespace("  hello world  ")).toBe("hello world");
      expect(normalizeWhitespace("   test   ")).toBe("test");
    });

    it("should normalize tabs and newlines", () => {
      expect(normalizeWhitespace("hello\t\tworld")).toBe("hello world");
      expect(normalizeWhitespace("hello\n\nworld")).toBe("hello world");
      expect(normalizeWhitespace("hello\r\nworld")).toBe("hello world");
    });
  });

  describe("isValidHttpUrl", () => {
    it("should return true for valid HTTPS URLs", () => {
      expect(isValidHttpUrl("https://example.com")).toBe(true);
      expect(isValidHttpUrl("https://www.example.com")).toBe(true);
      expect(isValidHttpUrl("https://example.com/path")).toBe(true);
      expect(isValidHttpUrl("https://example.com:8080")).toBe(true);
    });

    it("should return false for HTTP URLs", () => {
      expect(isValidHttpUrl("http://example.com")).toBe(false);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidHttpUrl("not-a-url")).toBe(false);
      expect(isValidHttpUrl("example.com")).toBe(false);
      expect(isValidHttpUrl("ftp://example.com")).toBe(false);
    });

    it("should return false for empty strings", () => {
      expect(isValidHttpUrl("")).toBe(false);
      expect(isValidHttpUrl("  ")).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isValidHttpUrl(null)).toBe(false);
      expect(isValidHttpUrl(undefined)).toBe(false);
      expect(isValidHttpUrl(123)).toBe(false);
    });
  });

  describe("SanitizedString", () => {
    it("should apply min length validation", () => {
      const schema = SanitizedString(30, 3);
      expect(() => schema.parse("ab")).toThrow();
      expect(schema.parse("abc")).toBeTruthy();
    });

    it("should apply max length validation", () => {
      const schema = SanitizedString(10);
      const longString = "a".repeat(20);
      expect(() => schema.parse(longString)).toThrow();
      const validString = "a".repeat(10);
      expect(schema.parse(validString)).toBe(validString);
      
    });

    it("should normalize whitespace", () => {
      const schema = SanitizedString(30);
      expect(schema.parse("hello  world")).toBe("hello world");
    });

    it("should trim whitespace", () => {
      const schema = SanitizedString(30);
      expect(schema.parse("  hello  ")).toBe("hello");
    });

    it("should escape HTML", () => {
      const schema = SanitizedString(50);
      expect(schema.parse("<script>")).toBe("&lt;script&gt;");
    });

    it("should apply regex pattern validation", () => {
      const schema = SanitizedString(30, 3, /^[a-zA-Z0-9_]+$/);
      expect(() => schema.parse("test-user")).toThrow();
      expect(schema.parse("test_user")).toBeTruthy();
    });

    it("should handle default value", () => {
      const schema = SanitizedString(30);
      expect(schema.parse(undefined)).toBe("");
    });

    it("should apply all transformations in order", () => {
      const schema = SanitizedString(20);
      const input = "  <b>Hello  World</b>  ";
      const result = schema.parse(input);
      expect(result).toBe("&lt;b&gt;Hello World&lt;/b&gt;");
    });
  });

  describe("SanitizedUrl", () => {
    it("should accept valid HTTPS URLs", () => {
      const schema = SanitizedUrl();
      expect(schema.parse("https://example.com")).toBe("https://example.com");
      expect(schema.parse("https://www.example.com/path")).toBe(
        "https://www.example.com/path"
      );
    });

    it("should reject HTTP URLs", () => {
      const schema = SanitizedUrl();
      expect(() => schema.parse("http://example.com")).toThrow();
    });

    it("should reject invalid URLs", () => {
      const schema = SanitizedUrl();
      expect(() => schema.parse("not-a-url")).toThrow();
    });

    it("should accept empty strings", () => {
      const schema = SanitizedUrl();
      expect(schema.parse("")).toBe("");
    });

    it("should trim whitespace", () => {
      const schema = SanitizedUrl();
      expect(schema.parse("  https://example.com  ")).toBe("https://example.com");
    });

    it("should transform invalid URLs to empty string", () => {
      const schema = SanitizedUrl();
      const result = schema.safeParse("invalid-url");
      expect(result.success).toBe(false);
    });
  });

  describe("SocialsSchema", () => {
    it("should accept valid social links with URLs", () => {
      const input = {
        github: "https://github.com/user",
        twitter: "https://x.com/user",
      };
      const result = SocialsSchema.parse(input);
      expect(result.github).toBe("https://github.com/user");
    });

    it("should filter out non-allowed keys", () => {
      const input = {
        github: "https://github.com/user",
        notAllowed: "https://example.com",
      };
      const result = SocialsSchema.parse(input);
      expect(result.github).toBe("https://github.com/user");
      expect(result.notAllowed).toBeUndefined();
    });

    it("should keep only allowed social keys", () => {
      const input = {
        x: "https://x.com/user",
        instagram: "https://instagram.com/user",
        github: "https://github.com/user",
        telegram: "https://t.me/user",
        tiktok: "https://tiktok.com/@user",
        youtube: "https://youtube.com/user",
        linkedin: "https://linkedin.com/in/user",
        facebook: "https://facebook.com/user",
        invalidKey: "https://example.com",
      };
      const result = SocialsSchema.parse(input);
      expect(result.x).toBeDefined();
      expect(result.instagram).toBeDefined();
      expect(result.github).toBeDefined();
      expect(result.telegram).toBeDefined();
      expect(result.tiktok).toBeDefined();
      expect(result.youtube).toBeDefined();
      expect(result.linkedin).toBeDefined();
      expect(result.facebook).toBeDefined();
      expect(result.invalidKey).toBeUndefined();
    });

    it("should handle non-URL social handles", () => {
      const input = {
        telegram: "@username",
      };
      const result = SocialsSchema.parse(input);
      expect(result.telegram).toBe("@username");
    });

    it("should escape HTML in non-URL values", () => {
      const input = {
        telegram: "<script>alert('xss')</script>",
      };
      const result = SocialsSchema.parse(input);
      expect(result.telegram).toContain("&lt;");
      expect(result.telegram).toContain("&gt;");
    });

    it("should trim whitespace from values", () => {
      const input = {
        github: "  https://github.com/user  ",
      };
      const result = SocialsSchema.parse(input);
      expect(result.github).toBe("https://github.com/user");
    });

    it("should ignore empty string values", () => {
      const input = {
        github: "",
        telegram: "https://t.me/user",
      };
      const result = SocialsSchema.parse(input);
      expect(result.github).toBeUndefined();
      expect(result.telegram).toBeDefined();
    });

    it("should cap non-URL values at 100 characters", () => {
      const longHandle = "a".repeat(150);
      const input = {
        telegram: longHandle,
      };
      const result = SocialsSchema.parse(input);
      expect(result.telegram.length).toBeLessThanOrEqual(100);
    });

    it("should normalize whitespace in non-URL values", () => {
      const input = {
        telegram: "@user  name  test",
      };
      const result = SocialsSchema.parse(input);
      expect(result.telegram).toBe("@user name test");
    });
  });

  describe("profileFormInputSchema", () => {
    it("should validate complete profile form", () => {
      const validData = {
        username: "testuser",
        displayName: "Test User",
        bio: "This is a test bio",
        socials: {
          github: "https://github.com/testuser",
        },
        link: "https://example.com",
      };
      const result = profileFormInputSchema.parse(validData);
      expect(result.username).toBe("testuser");
      expect(result.displayName).toBe("Test User");
    });

    it("should reject username with invalid characters", () => {
      const invalidData = {
        username: "test-user!",
        displayName: "Test User",
        bio: "",
        socials: {},
        link: "",
      };
      expect(() => profileFormInputSchema.parse(invalidData)).toThrow();
    });

    it("should reject short username", () => {
      const invalidData = {
        username: "ab",
        displayName: "Test User",
        bio: "",
        socials: {},
        link: "",
      };
      expect(() => profileFormInputSchema.parse(invalidData)).toThrow();
    });

    it("should reject short display name", () => {
      const invalidData = {
        username: "testuser",
        displayName: "ab",
        bio: "",
        socials: {},
        link: "",
      };
      expect(() => profileFormInputSchema.parse(invalidData)).toThrow();
    });

    it("should accept optional bio", () => {
      const validData = {
        username: "testuser",
        displayName: "Test User",
        bio: "",
        socials: {},
        link: "",
      };
      const result = profileFormInputSchema.parse(validData);
      expect(result.bio).toBe("");
    });

    it("should accept optional link", () => {
      const validData = {
        username: "testuser",
        displayName: "Test User",
        bio: "Test bio",
        socials: {},
        link: "",
      };
      const result = profileFormInputSchema.parse(validData);
      expect(result.link).toBe("");
    });

    it("should reject invalid link URL", () => {
      const invalidData = {
        username: "testuser",
        displayName: "Test User",
        bio: "",
        socials: {},
        link: "not-a-url",
      };
      expect(() => profileFormInputSchema.parse(invalidData)).toThrow();
    });

    it("should sanitize all fields", () => {
      const dirtyData = {
        username: "  test_user  ",
        displayName: "  Test  User  ",
        bio: "  Test   bio  ",
        socials: {},
        link: "  https://example.com  ",
      };
      const result = profileFormInputSchema.parse(dirtyData);
      expect(result.username).toBe("test_user");
      expect(result.displayName).toBe("Test User");
      expect(result.bio).toBe("Test bio");
      expect(result.link).toBe("https://example.com");
    });
  });
});

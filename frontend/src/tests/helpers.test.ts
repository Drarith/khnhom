import { describe, it, expect } from "vitest";
import { normalizeValue } from "@/helpers/normalizeVal";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";

describe("Helper Functions", () => {
  describe("normalizeValue", () => {
    it("should return the value if it exists", () => {
      expect(normalizeValue("hello")).toBe("hello");
      expect(normalizeValue("test")).toBe("test");
    });

    it("should return empty string for null", () => {
      expect(normalizeValue(null)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(normalizeValue(undefined)).toBe("");
      expect(normalizeValue()).toBe("");
    });

    it("should handle empty strings", () => {
      expect(normalizeValue("")).toBe("");
    });

    it("should handle strings with whitespace", () => {
      expect(normalizeValue("  hello  ")).toBe("  hello  ");
    });

    it("should handle numbers as strings", () => {
      expect(normalizeValue("123")).toBe("123");
      expect(normalizeValue("0")).toBe("0");
    });
  });

  describe("getAxiosErrorMessage", () => {
    it("should return error message from response data", () => {
      const error = {
        response: {
          data: {
            message: "Custom error message",
          },
        },
        message: "Fallback message",
      } as AxiosError<{ message?: string }>;

      expect(getAxiosErrorMessage(error)).toBe("Custom error message");
    });

    it("should return error message property if response message is undefined", () => {
      const error = {
        response: {
          data: {},
        },
        message: "Fallback message",
      } as AxiosError<{ message?: string }>;

      expect(getAxiosErrorMessage(error)).toBe("Fallback message");
    });

    it("should return error message if no response", () => {
      const error = {
        message: "Network error",
      } as AxiosError<{ message?: string }>;

      expect(getAxiosErrorMessage(error)).toBe("Network error");
    });

    it("should prioritize response data message over error message", () => {
      const error = {
        response: {
          data: {
            message: "Response message",
          },
        },
        message: "Error message",
      } as AxiosError<{ message?: string }>;

      expect(getAxiosErrorMessage(error)).toBe("Response message");
    });

    it("should handle empty response data", () => {
      const error = {
        response: {
          data: {},
        },
        message: "Default error",
      } as AxiosError<{ message?: string }>;

      expect(getAxiosErrorMessage(error)).toBe("Default error");
    });
  });
});

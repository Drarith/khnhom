import { describe, it, expect, beforeAll } from "vitest";
import { checkUrlSafe } from "../../src/utils/googleSafeBrowsing.js";
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') })

// These tests make real API calls to the Google Safe Browsing API.
// They require a valid GOOGLE_SB_API key in the environment.
describe("googleSafeBrowsing.checkUrlSafe (live API)", () => {
  let apiKeyPresent = false;
  const GOOGLE_SB_API = process.env.GOOGLE_SB_API

  beforeAll(() => {
    if (GOOGLE_SB_API) {
      apiKeyPresent = true;
    } else {
      console.warn(
        "Skipping live Google Safe Browsing API tests: GOOGLE_SB_API key not found in environment."
      );
    }
  });

  it("returns true for an empty url", async () => {
    const res = await checkUrlSafe("");
    expect(res).toBe(true);
  });

  it.skipIf(!apiKeyPresent)(
    "should return true for a known safe URL",
    async () => {
      const safeUrl = "https://www.google.com";
      const isSafe = await checkUrlSafe(safeUrl);
      expect(isSafe).toBe(true);
    },
    30000 // Increase timeout for network request
  );

  it.skipIf(!apiKeyPresent)(
    "should return false for a known malicious URL",
    async () => {
      // This is a special test URL provided by Google
      const unsafeUrl = "http://malware.testing.google.test/testing/malware/";
      const isSafe = await checkUrlSafe(unsafeUrl);
      expect(isSafe).toBe(false);
    },
    30000 // Increase timeout for network request
  );
});

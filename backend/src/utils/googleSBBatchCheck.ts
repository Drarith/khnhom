import { env } from "../config/myEnv.js";

// --- Configuration ---
// Note: GOOGLE_SB_API is retrieved from your .env file
const GOOGLE_SB_API = env.GOOGLE_SB_API;

const GOOGLE_SAFE_BROWSING_ENDPOINT = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SB_API}`;

/**
 * Checks an array of URLs against the Google Safe Browsing API.
 * * @param {string[]} urls - An array of URLs to check for threats.
 * @returns {Promise<boolean>} - Resolves to `true` if all URLs are safe, `false` if any URL is unsafe.
 */
export async function checkUrlsSafe(urls:string[]) {
  if (!urls || urls.length === 0) {
    return true; // No URLs to check, so considered safe.
  }

  // API payload structure requires each URL as a threat entry object
  const threatEntries = urls.map((url) => ({ url }));

  const payload = {
    client: {
      // IMPORTANT: Replace "your-app-name" with a unique identifier for your project
      clientId: "my-user-profile-app", 
      clientVersion: "1.0.0",
    },
    threatInfo: {
      // Check against all major threat types for links
      threatTypes: [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION",
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: threatEntries,
    },
  };

  try {
    const response = await fetch(GOOGLE_SAFE_BROWSING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check for API-level errors (e.g., 400, 500)
    if (!response.ok) {
      console.error(`Safe Browsing API Request Failed: ${response.status} ${response.statusText}`);
      // As a security measure, fail to safe (return false) if the check itself fails.
      return false; 
    }

    const result = await response.json();

    // The 'matches' property is only present if one or more threats were found.
    const isSafe = !result.matches;

    return isSafe;

  } catch (error) {
    console.error("Critical error during Safe Browsing API call:", error);
    // Fail to safe if there's a network or parsing error
    return false;
  }
}

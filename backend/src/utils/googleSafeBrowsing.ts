import dotenv from "dotenv";

dotenv.config();

const GOOGLE_SB_API = process.env.GOOGLE_SB_API;
if (!GOOGLE_SB_API) {
  throw new Error("No Google safe browsing key found.");
}
const GOOGLE_SAFE_BROWSING_ENDPOINT = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SB_API}`;

export async function checkUrlSafe(url: string) {
  if (!url) {
    return true; // An empty list is considered "safe"
  }

  const payload = {
    client: {
      clientId: "innate-bucksaw-476711-t1",
      clientVersion: "1.0.0",
    },
    threatInfo: {
      threatTypes: [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION",
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }],
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

    if (!response.ok) {
      // If the API request itself fails, log it and assume unsafe
      console.error(`Google Safe Browsing API error: ${response.statusText}`);
      return false;
    }

    const result = await response.json();

    // If 'matches' exists and is a non-empty array, the URL is unsafe.
    // If the response is an empty object {} or matches is empty/absent, it's safe.
    const matches = result?.matches;
    return !(Array.isArray(matches) && matches.length > 0);
  } catch (error) {
    console.error("Error calling Google Safe Browsing API:", error);
    // Fail-safe: If the check fails, assume it's unsafe.
    return false;
  }
}

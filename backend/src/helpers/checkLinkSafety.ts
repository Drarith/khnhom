import { checkUrlSafe } from "../utils/googleSafeBrowsing.js";
import { checkUrlsSafe } from "../utils/googleSBBatchCheck.js";

export const isLinkSafe = async (url: string): Promise<void> => {
  if (!url) {
    return;
  }

  let isSafe;
  try {
    isSafe = await checkUrlSafe(url);
  } catch (err) {
    throw new Error("Unable to verify link's safety.");
  }

  if (!isSafe) {
    throw new Error(
      "Provided link URL is unsafe or blocked by security policy."
    );
  }
};

export const areLinkSafe = async (urls: string[]): Promise<void> => {
  if (!urls) {
    return;
  }

  let isSafe;
  try {
    isSafe = await checkUrlsSafe(urls);
  } catch (err) {
    throw new Error("Unable to verify links' safety.");
  }

  if (!isSafe) {
    throw new Error(
      "One or more provided links URL are unsafe or blocked by security policy."
    );
  }
};

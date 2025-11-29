import { type Request, type Response } from "express";
import mongoose from "mongoose";

import type {
  CreateProfile,
  ProfileCreationInput,
  profileUpdateInput,
} from "../types/user-input.types.js";

import Profile from "../model/profileModel.js";
import Link from "../model/linkModel.js";

import {
  sanitizeCreateProfile,
  SanitizedString,
  SocialsSchema,
  type SanitizedCreateProfile,
} from "../utils/sanitizeUtils.js";
import { SanitizedUrl } from "../utils/sanitizeUtils.js";

import { getErrorMessage } from "../utils/getErrorMessage.js";

import type { IProfile } from "../model/types-for-models/profileModel.types.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

import { areLinkSafe, isLinkSafe } from "../helpers/checkLinkSafety.js";

export const createProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const {
    username,
    displayName,
    bio,
    profilePictureUrl,
    paymentQrCodeUrl,
    socials,
    link,
    theme,
  } = req.body as CreateProfile;

  const userId = (req.user as IUser).id;
  if (!userId) return res.status(400).json({ message: "User id not found!" });

  const existingUser = req.profile?.id;
  if (existingUser)
    return res.status(400).json({ message: "Profile already existed." });

  const profileData: ProfileCreationInput = {
    user: userId.toString(),
    username: username || "",
    displayName: displayName || "",
    bio: bio || "",
    profilePictureUrl: profilePictureUrl || "",
    paymentQrCodeUrl: paymentQrCodeUrl || "",
    socials: socials || {},
    theme: theme || "",
  };

  try {
    const cleanedProfileData: SanitizedCreateProfile =
      sanitizeCreateProfile(profileData);

    // Check social links for safety
    if (cleanedProfileData.socials) {
      const socialValues = Object.values(cleanedProfileData.socials);
      if (socialValues.length > 0) {
        try {
          await areLinkSafe(socialValues);
        } catch (err) {
          const msg = getErrorMessage(err);
          return res.status(400).json({ msg });
        }
      }
    }

    let validatedLink:
      | { title: string; url: string; description?: string }
      | undefined = undefined;

    if (link) {
      if (!link.title || !link.url) {
        return res
          .status(400)
          .json({ message: "If providing link, title and url are required." });
      }

      const safeTitle = SanitizedString(30).parse(link.title);
      const safeDescription = link.description
        ? SanitizedString(300).parse(link.description)
        : "";
      const safeUrl = SanitizedUrl().parse(link.url);

      // will return with 400 if link found to be not safe with google safe browsing.
      try {
        await isLinkSafe(safeUrl);
      } catch (err) {
        const msg = getErrorMessage(err);
        return res.status(400).json({ msg });
      }

      if (!safeTitle || safeTitle.trim().length === 0) {
        return res.status(400).json({ message: "Invalid link title." });
      }
      if (!safeUrl || safeUrl.trim() === "") {
        return res.status(400).json({ message: "Invalid link URL." });
      }

      validatedLink = {
        title: safeTitle,
        url: safeUrl,
        description: safeDescription,
      };
    }

    const profile = await Profile.createProfile(cleanedProfileData);

    if (validatedLink) {
      try {
        const linkData = {
          profile: profile._id.toString(),
          title: validatedLink.title,
          url: validatedLink.url,
          description: validatedLink.description || "",
        };
        const createdLink = await Link.createLink(linkData);
        profile.links.push(createdLink._id);
        await profile.save();
      } catch (linkErr) {
        console.error("Failed to create link while creating profile:", linkErr);
        return res.status(201).json({
          success: true,
          message:
            "Profile created successfully, but link creation failed. Please try adding the link separately.",
          profile,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Profile created successfully!",
      profile,
    });
  } catch (err) {
    const msg = getErrorMessage(err);
    if (msg === "Invalid profile data") {
      console.error(err);
      return res.status(400).json({ message: msg });
    }
    if ((err as Error)?.name === "ValidationError") {
      return res.status(400).json({ error: (err as Error).message });
    }
    return res.status(500).json({ error: "Unable to create profile." + msg });
  }
};

export const getProfileByUsername = async (req: Request, res: Response) => {
  const username = req.params.username;
  if (!username) return res.status(400).json({ error: "Username is required" });
  try {
    const profile = (await Profile.findOne({ username }).populate(
      "user",
      "isSupporter"
    )) as IProfile | null;
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const getProfileLinks = async (req: Request, res: Response) => {
  const username = req.params.username;
  if (!username) return res.status(400).json({ error: "Username is required" });
  try {
    const profile = (await Profile.findOne({ username })) as IProfile | null;
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    const links = await Link.findByProfile(profile._id.toString());
    return res.status(200).json(links);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const createAndAddLinkToProfile = async (
  req: Request,
  res: Response
) => {
  const { title, url } = req.body.link;
  const user = req.user;
  let safeLink: string;
  let safeTitle: string;
  if (!user) return res.status(401).json({ error: "Unauthorized." });

  if (!title || !url)
    return res
      .status(400)
      .json({ error: "Please include both title and url." });

  try {
    const links = await Link.findByProfile(req.profile.id);
    if (links.length >= 10) {
      return res.status(403).json({ message: "Links limit has been reached." });
    }
  } catch (err) {
    const msg = getErrorMessage(err);
    return res.status(400).json({ msg });
  }

  try {
    const userId = (user as IUser).id;
    if (!userId) return res.status(400).json({ message: "User id not found!" });

    const profile = req.profile as IProfile | null;
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    try {
      safeLink = SanitizedUrl().parse(url);
      safeTitle = SanitizedString(30).parse(title);
    } catch (zErr) {
      return res
        .status(400)
        .json({ message: "Invalid link data", error: zErr });
    }
    try {
      await isLinkSafe(safeLink);
    } catch (err) {
      const msg = getErrorMessage(err);
      return res.status(400).json({ msg });
    }

    if (!safeLink || safeLink.trim() === "") {
      return res.status(400).json({ message: "Invalid or unsupported URL" });
    }

    const newLink = await profile.addLink({
      title: safeTitle,
      url: safeLink,
    });

    return res
      .status(201)
      .json({ message: "Added successfully.", link: newLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to create link, please try again later." });
  }
};

// use this controller to delete or update profile
export const updateProfile = async (req: Request, res: Response) => {
  const profileData: profileUpdateInput = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = (req.user as IUser).id;
  if (!userId) return res.status(400).json({ message: "User id not found!" });

  try {
    const profile = req.profile as IProfile | null;
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const updates: Partial<profileUpdateInput> = {};

    if (profileData.displayName !== undefined) {
      const safeDisplay = SanitizedString(50).parse(profileData.displayName);
      updates.displayName = safeDisplay;
    }

    if (profileData.bio !== undefined) {
      const safeBio = SanitizedString(1000).parse(profileData.bio);
      updates.bio = safeBio;
    }

    if (profileData.profilePictureUrl !== undefined) {
      const safeUrl = SanitizedUrl().parse(profileData.profilePictureUrl);
      if (!safeUrl || safeUrl.trim() === "") {
        return res
          .status(400)
          .json({ message: "Invalid profile picture URL." });
      }
      updates.profilePictureUrl = safeUrl;
    }

    if (profileData.paymentQrCodeUrl !== undefined) {
      const safeQr = SanitizedUrl().parse(profileData.paymentQrCodeUrl);
      if (!safeQr || safeQr.trim() === "") {
        return res
          .status(400)
          .json({ message: "Invalid payment QR code URL." });
      }
      updates.paymentQrCodeUrl = safeQr;
    }

    if (profileData.socials !== undefined) {
      try {
        const sanitizedSocials = SocialsSchema.parse(profileData.socials);
        const linksEntries = Object.values(sanitizedSocials);

        try {
          if (linksEntries.length > 0) {
            await areLinkSafe(linksEntries);
          }
        } catch (err) {
          const msg = getErrorMessage(err);
          return res.status(400).json({ message: msg });
        }
        updates.socials = sanitizedSocials;
      } catch (zErr) {
        return res
          .status(400)
          .json({ message: "Invalid socials data", error: zErr });
      }
    }

    if (profileData.theme !== undefined) {
      const safeTheme = SanitizedString(50).parse(profileData.theme);
      updates.theme = safeTheme;
    }

    Object.assign(profile, updates);
    await profile.save();

    return res
      .status(200)
      .json({ success: true, message: "Profile updated.", profile });
  } catch (err) {
    if ((err as Error)?.name === "ValidationError") {
      return res.status(400).json({ error: (err as Error).message });
    }
    const msg = getErrorMessage(err);
    return res.status(500).json({ error: "Unable to update profile. " + msg });
  }
};

export const deleteLinkFromProfile = async (req: Request, res: Response) => {
  const linkId = req.params.linkId;
  if (!linkId) {
    return res.status(400).json({ message: "linkId is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    return res.status(400).json({ message: "Invalid linkId format" });
  }
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = (req.user as IUser).id;
  if (!userId) return res.status(400).json({ message: "User id not found!" });

  const userProfile = req.profile as IProfile | null;
  if (!userProfile) {
    return res.status(400).json({ message: "User profile not found" });
  }

  const linkExists = userProfile.links.map(String).includes(linkId);
  if (!linkExists) {
    return res.status(404).json({ message: "Link not found in user profile" });
  }

  try {
    userProfile.links = userProfile.links.filter((l) => String(l) !== linkId);
    await userProfile.save();

    await Link.findByIdAndDelete(linkId);

    return res
      .status(200)
      .json({ success: true, message: "Link deleted from profile." });
  } catch (err) {
    const msg = getErrorMessage(err);
    return res.status(500).json({ error: "Unable to delete link. " + msg });
  }
};

export const currentUserProfile = async (req: Request, res: Response) => {
  if (!req.user && !req.profile)
    return res
      .status(400)
      .json({ message: "Something went wrong, profile not found." });

  try {
    await req.profile.populate({
      path: "links",
      model: "Link",
    });

    const currentUserProfile = req.profile;
    console.log(currentUserProfile);

    return res.status(200).json({ data: currentUserProfile });
  } catch (error) {
    return res.status(500).json({ message: "Population failed" });
  }
};

export const updateProfilePictureUrl = async (req: Request, res: Response) => {
  if (!req.user && !req.profile) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(req.body);
  const { profilePictureUrl } = req.body;
  if (!profilePictureUrl) {
    return res.status(400).json({ message: "profilePictureUrl is required." });
  }
  const userProfile = req.profile as IProfile;
  await userProfile.updateProfilePictureUrl(profilePictureUrl);
  return res.status(201).json({ message: "Profile picture updated." });
};

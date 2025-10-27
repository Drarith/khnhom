import type { Request, Response, NextFunction } from "express";

import type {
  CreateProfile,
  ProfileCreationInput,
} from "../types/user-input.types.js";

import Profile from "../model/profileModel.js";
import Link from "../model/linkModel.js";

import {
  sanitizeCreateProfile,
  SanitizedString,
  type SanitizedCreateProfile,
} from "../utils/sanitizeUtils.js";
import { SanitizedUrl } from "../utils/sanitizeUtils.js";

import { getErrorMessage } from "../utils/getErrorMessage.js";

import type { IProfile } from "../model/types-for-models/profileModel.types.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

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
          message: "Profile created successfully, but link creation failed. Please try adding the link separately.",
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
    if ((err as any)?.name === "ValidationError") {
      return res.status(400).json({ error: (err as any).message });
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
  const { title, url, description } = req.body;
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized." });

  if (!title || !url)
    return res
      .status(400)
      .json({ error: "Please include both title and url." });

  try {
    const userId = (user as IUser).id;
    if (!userId) return res.status(400).json({ message: "User id not found!" });

    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Use zod parsing inside try and map validation errors to 400
    let safeLink: string;
    let safeTitle: string;
    let safeDescription: string;
    try {
      safeLink = SanitizedUrl().parse(url);
      safeTitle = SanitizedString(30).parse(title);
      safeDescription = SanitizedString(200).parse(description);
    } catch (zErr) {
      // zErr is a ZodError -> client input invalid
      return res
        .status(400)
        .json({ message: "Invalid link data", error: zErr });
    }

    // SanitizedUrl transforms invalid URLs into empty string — reject empty url
    if (!safeLink || safeLink.trim() === "") {
      return res.status(400).json({ message: "Invalid or unsupported URL" });
    }

    const newLink = await profile.addLink({
      title: safeTitle,
      url: safeLink,
      description: safeDescription,
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

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    username,
    displayName,
    bio,
    profilePictureUrl,
    paymentQrCodeUrl,
    socials,
  } = req.body;
};

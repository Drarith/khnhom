import type { Request, Response, NextFunction } from "express";

import type {
  CreateProfile,
  ProfileCreationInput,
} from "../types/user-input.types.js";
import Profile from "../model/profileModel.js";
import Link from "../model/linkModel.js";
import { sanitizeCreateProfile, type SanitizedCreateProfile } from "../utils/sanitizeUtils.js";
import type {
  IProfile,
} from "../model/types-for-models/profileModel.types.js";
import type {IUser} from '../model/types-for-models/userModel.types.js'


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
    theme,
  } = req.body as CreateProfile;
  try {
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
    const cleanedProfileData: SanitizedCreateProfile = sanitizeCreateProfile(profileData);
    // if (!cleanedProfileData) {
    //   return res.status(400).json({ error: "Invalid profile data" });
    // }
    await Profile.createProfile(cleanedProfileData);
    return res
      .status(200)
      .json({ success: true, message: "Profile created successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Unable to create profile." + err });
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
    return res.status(500).json({ error: "Server error" });
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
    return res.status(500).json({ error: "Server error" });
  }
};

export const createAndAddLinkToProfile = async (
  req: Request,
  res: Response
) => {
  const { title, url, description } = req.body;
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized." });

  if (!title || !url)
    return res
      .status(400)
      .json({ message: "Please include both title and url." });
  try {
    // .id instead of ._id because of our user payload
    const userId = (user as IUser).id;
    if (!userId) return res.status(400).json({ message: "User id not found!" });

    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const newLink = await profile.addLink({
      title,
      url,
      description,
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
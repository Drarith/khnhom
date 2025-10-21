import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import dotenv from "dotenv";
import type { IUser } from "../model/types-for-models/userModel.types.js";
import type {
  CreateProfile,
  LinkCreationInput,
  ProfileCreationInput,
} from "../types/user-input.types.js";
import Profile from "../model/profileModel.js";
import Link from "../model/linkModel.js";
import { json } from "stream/consumers";
import type {
  IProfile,
  IProfileModel,
} from "../model/types-for-models/profileModel.types.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userExists = await User.emailExists(email);
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Email already exists, please log in instead." });
    }
    const user: IUser = await User.createUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    // executing our strategy from passport config
    // this is the returned function
    (err: Error, user: IUser | false, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Login failed" });
      }
      const payload = {
        id: user._id,
        email: user.email,
      };
      const token = jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: "1d",
      });

      return res
        .status(200)
        .json({ message: "Logged in successfully.", token: token });
    }
  )(
    // invoke the returned function immediately with req, res, next
    req,
    res,
    next
  );
};

export const logoutUser = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message:
      "Successfully logged out. Please remove the token from your client.",
  });
};

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
      user: userId,
      username: username || "",
      displayName: displayName || "",
      bio: bio || "",
      profilePictureUrl: profilePictureUrl || "",
      paymentQrCodeUrl: paymentQrCodeUrl || "",
      socials: socials || {},
      theme: theme || "",
    };
    await Profile.createProfile(profileData);
    return res
      .status(200)
      .json({ success: true, message: "Profile created successfully!" });
  } catch (err) {
    console.log(err);
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
    console.error(err);
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
    console.error(err);
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
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to create link, please try again later." });
  }
};

// export const getProfileLinks = async (req: Request, res: Response) => {
//   const username = req.params.username;
//   try {
//     const profile = await Profile.findByUsername(username);
//     if (!profile) return res.status(404).json({ error: "Profile not found" });
//     const links = await Link.findByProfile(profile._id.toString());
//     return res.status(200).json(links);
//   } catch (err) {
//     return res.status(500).json({ error: "Server error" });
//   }
// };

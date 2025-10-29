import type { Request, Response, NextFunction } from "express";
import Profile from "../model/profileModel.js";

// Anon profile view track using cookie
export const trackProfileView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username;
    // if (!username) {
    //   return next();
    // }

    const userProfile = await Profile.findOne({ user:username });
    if (!userProfile) {
      return next();
    }

    // const cookieKey = "viewedProfile";
    // let viewedProfiles: string[] = [];

    // const raw =
    //   (req as any).cookies?.[cookieKey] ?? (req.cookies as any)?.[cookieKey];
    // if (raw) {
    //   try {
    //     const parsed = JSON.parse(raw);
    //     if (Array.isArray(parsed)) viewedProfiles = parsed as string[];
    //   } catch (err) {
    //     // ignore malformed cookie
    //   }
    // }

    // if (!viewedProfiles.includes(username)) {
    //   viewedProfiles.push(username);
    //   res.cookie(cookieKey, JSON.stringify(viewedProfiles), {
    //     maxAge: 24 * 60 * 60 * 1000,
    //     httpOnly: true,
    //     sameSite: "lax",
    //   });

      await userProfile.incrementViews();
    // }

    // (req as any).profile = userProfile;
  } catch (err) {
    console.error("trackProfileView error:", err);
  } finally {
    next();
  }
};

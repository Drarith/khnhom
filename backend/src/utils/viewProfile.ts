import type { Request, Response, NextFunction } from "express";
import Profile from "../model/profileModel.js";

// Anon profile view track using cookie
export const trackProfileView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.params.username;
  const userProfile = await Profile.findOne({ username: user });
  if(!userProfile) return res.status(404).json({message:"Profile nit found."})
  if (req.cookies.viewProfile) {
    try {
      let viewedProfile: unknown[] = [];

      viewedProfile = JSON.parse(req.cookies.viewProfile) as unknown[];
      if (!Array.isArray(viewedProfile)) viewedProfile = [];
      if (!viewedProfile.includes(user)) {
        viewedProfile.push(user);
        res.cookie("viewedProfile", JSON.stringify(viewedProfile), {
          maxAge: 86400000,
          httpOnly: true,
        });
        const userProfile = await Profile.findOne({ username: user });
        userProfile?.incrementViews();
        userProfile?.save();
      }
      req.profile = userProfile
      next()
    } catch (err) {
      console.error(err);
      next();
    }
  }
};

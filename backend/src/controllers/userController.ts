import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

import { sendAuthTokens, clearAuthCookies } from "../helpers/httpOnlyCookie.js";
import { generateTokens, verifyRefreshToken } from "../utils/tokenUtils.js";

import type { IUser } from "../model/types-for-models/userModel.types.js";

import Profile from "../model/profileModel.js";
import UserRole from "../model/roleModel.js";

const secureCookie = true;

// For when we implement user registration with email/password
// export const createUser = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     const userExists = await User.emailExists(email);
//     if (userExists) {
//       return res
//         .status(400)
//         .json({ error: "Email already exists, please log in instead." });
//     }
//     const user: IUser = await User.createUser(email, password);
//     const userData = {
//       user: user._id,
//     };
//     await UserRole.createUserRole(userData);

//     const { accessToken, refreshToken } = generateTokens(user);
//     await user.updateRefreshToken(refreshToken);

//     return sendAuthTokens(res, accessToken, refreshToken, {
//       statusCode: 201,
//       message: "User created successfully.",
//       secure: secureCookie,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Unable to create user.", error: error });
//   }
// };

// export const loginUser = (req: Request, res: Response, next: NextFunction) => {
//   passport.authenticate(
//     "local",
//     { session: false },
//     // executing our strategy from passport config
//     // this is the returned function
//     async (err: Error, user: IUser | false, info?: { message: string }) => {
//       if (err) {
//         return next(err);
//       }
//       if (!user) {
//         return res
//           .status(401)
//           .json({ message: info?.message || "Login failed" });
//       }

//       const { accessToken, refreshToken } = generateTokens(user);
//       await user.updateRefreshToken(refreshToken);

//       sendAuthTokens(res, accessToken, refreshToken, {
//         message: "Logged in successfully.",
//         secure: secureCookie,
//       });
//     }
//   )(
//     // invoke the returned function immediately with req, res, next
//     req,
//     res,
//     next
//   );
// };

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    // make callback async so we can await DB calls
    async (err: Error, user: IUser | false, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Authentication failed" });
      }

      try {
        const { accessToken, refreshToken } = generateTokens(user);
        await user.updateRefreshToken(refreshToken);

        const existingProfile = await Profile.findOne({ user: user._id });

        const base = process.env.FRONTEND_URL;
        const redirectTo = existingProfile
          ? `${base}/dashboard`
          : `${base}/create-profile`;

        sendAuthTokens(res, accessToken, refreshToken, {
          message: existingProfile
            ? "Google authentication successful."
            : "Google authentication successful. Please create your profile.",
          secure: secureCookie,
          redirectTo,
        });
      } catch (dbErr) {
        console.error("Profile lookup failed:", dbErr);

        return res.status(200).json({
          message:
            "Authenticated, but profile check failed. Please refresh or try again.",
        });
      }
    }
  )(req, res, next);
};

export const logoutUser = async (req: Request, res: Response) => {
  // Clear refresh token from database
  if (req.user) {
    try {
      const userId = (req.user as IUser).id;
      const user = await User.findById(userId);
      if (user) {
        await user.clearRefreshToken();
      }
    } catch (error) {
      console.error("Error clearing refresh token:", error);
    }
  }

  clearAuthCookies(res, secureCookie);

  res.status(200).json({ message: "Logged out successfully" });
};

export const deactivateAccountByUsername = async (
  req: Request,
  res: Response
) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const profile = await Profile.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!profile.isActive) {
      return res
        .status(400)
        .json({ message: "This profile is already deactivated" });
    }

    profile.isActive = false;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: `Profile ${username} has been deactivated successfully`,
    });
  } catch (error) {
    console.error("Error deactivating account:", error);
    return res.status(500).json({
      message: "Unable to deactivate account",
      error: error,
    });
  }
};

export const reactivateAccountByUsername = async (
  req: Request,
  res: Response
) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const profile = await Profile.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.isActive) {
      return res
        .status(400)
        .json({ message: "This profile is already active" });
    }

    profile.isActive = true;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: `Profile ${username} has been reactivated successfully`,
    });
  } catch (error) {
    console.error("Error reactivating account:", error);
    return res.status(500).json({
      message: "Unable to reactivate account",
      error: error,
    });
  }
};

export const getUserRole = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = (req.user as IUser).id;
    const userRole = await UserRole.findOne({ user: userId });

    if (!userRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json({ role: userRole.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }
  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    // Find the user and verify the refresh token matches
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      if (
        user.previousRefreshTokenExpiry &&
        user.previousRefreshTokenExpiry === refreshToken &&
        user.previousRefreshTokenExpiry &&
        user.previousRefreshTokenExpiry > new Date()
      ) {
        // Token matches previous token and is within grace period.
        // Proceed with rotation.
      } else {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update refresh token in database
    await user.updateRefreshToken(newRefreshToken);

    // Send new tokens
    return sendAuthTokens(res, accessToken, newRefreshToken, {
      message: "Tokens refreshed successfully",
      secure: secureCookie,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const activeProfiles = await Profile.countDocuments({ isActive: true });

    // Aggregation to sum up all views
    const viewsResult = await Profile.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    // Count supporters
    const supporterCount = await Profile.countDocuments({ isSupporter: true });

    // Count gold supporters
    const goldSupporterCount = await Profile.countDocuments({
      isGoldSupporter: true,
    });

    // Count verified users
    const verifiedCount = await Profile.countDocuments({ isVerified: true });

    // Sum total donation amount
    const donationResult = await Profile.aggregate([
      { $group: { _id: null, totalDonation: { $sum: "$donationAmount" } } },
    ]);
    const totalDonationAmount =
      donationResult.length > 0 ? donationResult[0].totalDonation : 0;

    return res.status(200).json({
      totalUsers,
      totalProfiles,
      activeProfiles,
      totalViews,
      supporterCount,
      goldSupporterCount,
      verifiedCount,
      totalDonationAmount,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({ message: "Error fetching admin stats" });
  }
};

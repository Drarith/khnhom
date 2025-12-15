import type { Request, Response, NextFunction } from "express";
import UserRole from "../model/roleModel.js";
import { Role } from "../types/role.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = (req.user as IUser).id;
    const userRole = await UserRole.findOne({ user: userId });

    if (!userRole || userRole.role !== Role.Admin) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Error checking admin role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import type {Request, Response} from "express";
import User from "../model/userModel.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.createUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

import type {Request, Response} from "express";
import User from "../model/userModel.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.emailExists(email);
    if (userExists) {
      return res.status(400).json({ error: "Email already exists, please log in instead." });
    }
    const user: IUser = await User.createUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
import { Document, Model, Types } from "mongoose";

// Interface for the User document
// Interface for the User document and model in case your dumbass forgets
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  googleId?: string;
  isSupporter: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updatePassword(newPassword: string): Promise<void>;
}

// Interface for the User model (static methods)
export interface IUserModel extends Model<IUser> {
  createUser(email: string, password: string): Promise<IUser>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  emailExists(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<IUser | null>;
  findOrCreate(profile: unknown): Promise<IUser>;
  createGoogleUser(email: string, googleId: string): Promise<IUser>;
}

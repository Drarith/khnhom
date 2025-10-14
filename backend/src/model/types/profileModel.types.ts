import { Document, Model, Types } from "mongoose";

// Interface for social media links
export interface ISocials {
  facebook: string;
  instagram: string;
  telegram: string;
  youtube: string;
  linkedIn: string;
  x: string;
  tiktok: string;
  github: string;
}

// Interface for the Profile document
export interface IProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  username: string;
  displayName: string;
  bio: string;
  profilePictureUrl: string;
  paymentQrCodeUrl: string;
  socials: ISocials;
  theme: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  incrementViews(): Promise<void>;
  updateSocials(socials: Partial<ISocials>): Promise<void>;
}

// Interface for the Profile model (static methods)
export interface IProfileModel extends Model<IProfile> {
  findByUsername(username: string): Promise<IProfile | null>;
}

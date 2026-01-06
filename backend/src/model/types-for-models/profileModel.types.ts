import { Document, Model, Types } from "mongoose";
import type {
  ProfileCreationInput,
  LinkCreationInput,
} from "../../types/user-input.types.js";
import type { ILink } from "./linkModel.types.js";

// Interface for the Profile document and model in case your dumbass forgets
// Interface for social media links
export interface ISocials {
  facebook: string;
  instagram: string;
  telegram: string;
  youtube: string;
  linkedin: string;
  x: string;
  tiktok: string;
  github: string;
}

export interface IPaymentInfo {
  bakongAccountID: string;
  merchantName: string;
  merchantCity?: string;
  currency?: string;
  amount?: number;
  purpose?: string;
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
  links: Types.ObjectId[];
  theme: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isSupporter: boolean;
  isGoldSupporter: boolean;
  isVerified: boolean;
  isDev: boolean;
  isSpecial: boolean;
  donationAmount: number;
  isActive: boolean;

  // Instance methods
  incrementViews(): Promise<void>;
  updateSocials(socials: Partial<ISocials>): Promise<void>;
  updateProfile(
    this: IProfile,
    updateData: Partial<ProfileCreationInput>
  ): Promise<void>;
  addLink(this: IProfile, linkData: LinkCreationInput): Promise<ILink>;
  incrementViews(this: IProfile): Promise<void>;
  updateProfilePictureUrl(this: IProfile, newUrl: string): Promise<void>;
}

// Interface for the Profile model (static methods)
export interface IProfileModel extends Model<IProfile> {
  findByUsername(username: string): Promise<IProfile | null>;
  createProfile(profileData: ProfileCreationInput): Promise<IProfile>;
}

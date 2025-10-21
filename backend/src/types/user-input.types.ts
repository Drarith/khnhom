import { Types } from "mongoose";

export interface UserCreationInput {
  email: string;
  password: string;
  isSupporter?: boolean;
}

export interface ProfileCreationInput {
  user: Types.ObjectId;
  username: string;
  displayName: string;
  bio?: string;
  profilePictureUrl?: string;
  paymentQrCodeUrl?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    youtube?: string;
    linkedIn?: string;
    x?: string;
    tiktok?: string;
    github?: string;
  };
  theme?: string;
  views?: number;
}

export interface LinkCreationInput {
  profile?: Types.ObjectId;
  title: string;
  url: string;
  description?: string;
}

type Socials = Record<string, string>;

export interface CreateProfile {
  username?: string;
  displayName?: string;
  bio?: string;
  profilePictureUrl?: string;
  paymentQrCodeUrl?: string;
  socials?: Socials;
  theme?: string;
}

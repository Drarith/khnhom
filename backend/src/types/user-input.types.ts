import { Types } from "mongoose";

export type UserCreationInput = {
  email: string;
  password: string;
  isSupporter?: boolean;
}

export type ProfileCreationInput = {
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
};

export type LinkCreationInput = {
  profile: Types.ObjectId;
  title: string;
  url: string;
  description?: string;
};
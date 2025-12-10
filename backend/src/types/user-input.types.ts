import { Types } from "mongoose";

export interface UserCreationInput {
  email: string;
  password: string;
  isSupporter?: boolean;
}

export interface ProfileCreationInput {
  user: string;
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
    linkedin?: string;
    x?: string;
    tiktok?: string;
    github?: string;
  };
  link?: {
    title: string;
    url: string;
    description?: string;
    imageUrl?: string;
  };
  theme?: string;
  views?: number;
}

export interface profileUpdateInput {
  displayName?: string;
  bio?: string;
  profilePictureUrl?: string;
  paymentQrCodeUrl?: string;
  link?: Record<string, string>[];
  socials?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    youtube?: string;
    linkedin?: string;
    x?: string;
    tiktok?: string;
    github?: string;
  };
  theme?: string;
}

// Changed: include imageUrl as optional on LinkCreationInput
export interface LinkCreationInput {
  profile?: string | Types.ObjectId;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
}

type Socials = Record<string, string>;

export interface CreateProfile {
  username?: string;
  displayName?: string;
  bio?: string;
  profilePictureUrl?: string;
  paymentQrCodeUrl?: string;
  socials?: Socials;
  link?: { title: string; url: string; description: string; imageUrl?: string };
  theme?: string;
}

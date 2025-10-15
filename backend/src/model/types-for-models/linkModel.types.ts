import { Document, Model, Types } from "mongoose";
import type { LinkCreationInput } from "../../types/user-input.types.js";

// Interface for the Link document and model in case your dumbass forgets
export interface ILink extends Document {
  _id: Types.ObjectId;
  profile: Types.ObjectId;
  title: string;
  url: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  updateLink(title?: string, url?: string): Promise<ILink>;
}

export interface ILinkModel extends Model<ILink> {
  findByProfile(profileId: string): Promise<ILink[]>;
  createLink(linkData: LinkCreationInput): Promise<ILink>;
}

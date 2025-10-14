import { Document, Model, Types } from "mongoose";

export interface ILink extends Document {
  _id: Types.ObjectId;
  profile: Types.ObjectId;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  updateLink(title?: string, url?: string): Promise<ILink>;
}

export interface ILinkModel extends Model<ILink> {
  findByProfile(profileId: string): Promise<ILink[]>;
}

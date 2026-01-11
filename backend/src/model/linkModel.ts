import mongoose from "mongoose";

const { Schema } = mongoose;

import type { ILink, ILinkModel } from "./types-for-models/linkModel.types.js";

import type { LinkCreationInput } from "../types/user-input.types.js";

const linkSchema = new Schema<ILink>(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: { type: String, required: true, max: 50 },
    url: { type: String, required: true, max: 2000 },
    description: { type: String, default: "", max: 300 },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

linkSchema.index({ profile: 1 }); 
linkSchema.index({ profile: 1, title: 1 }); 

linkSchema.statics.findByProfile = function (profileId: string) {
  try {
    return this.find({ profile: profileId }).lean();
  } catch (err) {
    throw err;
  }
};

linkSchema.statics.createLink = async function (linkData: LinkCreationInput) {
  try {
    const existingTitle = await this.findOne({
      profile: linkData.profile,
      title: linkData.title,
    });
    if (existingTitle) {
      throw new Error("Link title must be unique");
    }
    const link = new this(linkData);
    await link.save();
    return link;
  } catch (err) {
    throw err;
  }
};

linkSchema.methods.updateLink = async function (title?: string, url?: string) {
  try {
    if (title) this.title = title;
    if (url) this.url = url;
    await this.save();
  } catch (err) {
    throw err;
  }
};
// okay apparently mongoose have findByIdAndDelete i am just a dumbass
linkSchema.statics.deleteLink = async function (linkId: string) {
  try {
    const linkToDelete = await this.findById(linkId);
    if (!linkToDelete) return false;
    await linkToDelete.deleteOne();
    return true;
  } catch (err) {
    throw err;
  }
};

const Link = mongoose.model<ILink, ILinkModel>("Link", linkSchema);

export default Link;

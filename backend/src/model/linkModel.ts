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
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

linkSchema.statics.findByProfile = function (profileId: string) {
  return this.find({ profile: profileId });
};

linkSchema.statics.createLink = async function (linkData: LinkCreationInput) {
  try {
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

const Link = mongoose.model<ILink, ILinkModel>("Link", linkSchema);

export default Link;

import mongoose from "mongoose";

const { Schema } = mongoose;

import type { ILink , ILinkModel} from "./types/linkModel.types.js";

const linkSchema = new Schema<ILink>(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

linkSchema.statics.findByProfile = function (profileId: string) {
  return this.find({ profile: profileId });
};

linkSchema.methods.updateLink = async function (title?: string, url?: string) {
  if (title) this.title = title;
  if (url) this.url = url;
  await this.save();
};

const Link = mongoose.model<ILink, ILinkModel>("Link", linkSchema)

export default Link

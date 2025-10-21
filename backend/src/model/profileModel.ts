import mongoose from "mongoose";
import type {
  IProfile,
  IProfileModel,
  ISocials,
} from "./types-for-models/profileModel.types.js";

import type {
  LinkCreationInput,
  ProfileCreationInput,
} from "../types/user-input.types.js";

import Link from "./linkModel.js";

const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 30,
      minlength: 3,
      match: [/^[a-zA-Z0-9_]+$/, "is invalid"],
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
      minlength: 3,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    paymentQrCodeUrl: {
      type: String,
      default: "",
    },

    socials: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      telegram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedIn: { type: String, default: "" },
      x: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    links: [{ type: Schema.Types.ObjectId, ref: "Link" }],
    theme: {
      type: String,
      default: "default",
    },
    selectedTemplate: {
      type: String,
      default: "default",
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

profileSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

profileSchema.methods.updateSocials = async function (
  socials: Partial<ISocials>
) {
  // Object.assign will copy the properties from socials to this.socials and overwrite existing ones
  Object.assign(this.socials, socials);
  await this.save();
};

profileSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};

profileSchema.statics.createProfile = async function (
  profileData: ProfileCreationInput
) {
  try {
    const profile = new this(profileData);
    await profile.save();
    return profile;
  } catch (error) {
    throw new Error("Error creating profile, " + error);
  }
};

profileSchema.methods.updateProfile = async function (
  this: IProfile,
  updateData: Partial<ProfileCreationInput>
) {
  Object.assign(this, updateData);
  await this.save();
};

profileSchema.methods.addLink = async function (
  this: IProfile,
  linkData: LinkCreationInput
) {
  // We need to clean this link somehow but for now just store it
  try {
    // spreading data so it stays on the same level
    const link = await Link.createLink({ ...linkData, profile: this._id });
    this.links = this.links || [];
    this.links.push(link._id);
    await this.save();
    return link;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating link" + error);
  }
};

const Profile = mongoose.model<IProfile, IProfileModel>(
  "Profile",
  profileSchema
);
export default Profile;

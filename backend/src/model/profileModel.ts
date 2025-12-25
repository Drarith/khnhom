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
import type { SanitizedCreateProfile } from "../utils/sanitizeUtils.js";

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
    paymentInfo: {
      bakongAccountID: { type: String, default: "" },
      merchantName: { type: String, default: "" },
      merchantCity: { type: String, default: "" },
      currency: { type: String, default: "KHR" },
      amount: { type: Number, default: 0 },
      purpose: { type: String, default: "" },
    },

    socials: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      telegram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      x: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    links: {
      type: [{ type: Schema.Types.ObjectId, ref: "Link" }],
      default: [],
    },
    theme: {
      type: String,
      default: "classic dark",
    },
    selectedTemplate: {
      type: String,
      default: "default",
    },
    backgroundImage: {
      type: String,
      default: "",
    },
    isSupporter: {
      type: Boolean,
      default: false,
    },
    isGoldSupporter: {
      type: Boolean,
      default: false,
    },
    donationAmount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDev: {
      type: Boolean,
      default: false,
    },
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
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

  try {
    Object.assign(this.socials, socials);
    await this.save();
  } catch (err) {
    throw err;
  }
};

profileSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};

profileSchema.statics.createProfile = async function (
  profileData: SanitizedCreateProfile
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
  try {
    Object.assign(this, updateData);
    await this.save();
  } catch (err) {
    throw err;
  }
};

profileSchema.methods.updateProfilePictureUrl = async function (
  this: IProfile,
  newUrl: string
) {
  try {
    this.profilePictureUrl = newUrl;
    await this.save();
  } catch (err) {
    throw err;
  }
};

profileSchema.methods.addLink = async function (
  this: IProfile,
  linkData: LinkCreationInput
) {
  // We need to clean this link somehow but for now just store it
  try {
    // spreading data so it stays on the same level
    const link = await Link.createLink({ ...linkData, profile: this._id });
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

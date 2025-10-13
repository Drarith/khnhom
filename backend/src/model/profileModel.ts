import mongoose from "mongoose";

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
    },
    displayName: {
      type: String,
      required: true,
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
    theme: {
      type: String,
      default: "default",
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);

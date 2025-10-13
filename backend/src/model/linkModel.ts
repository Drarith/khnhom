import mongoose from "mongoose";

const { Schema } = mongoose;

const linkSchema = new Schema(
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

export default mongoose.model("Link", linkSchema);

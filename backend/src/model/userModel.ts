import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import type { IUser, IUserModel } from "./types-for-models/userModel.types.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isSupporter: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Check if the password field has been modified
  // if not we return and go next
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.createUser = async function (
  email: string,
  password: string
) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = new this({ email, password });
    await user.save();
    return user;
  } catch (error) {
    console.log("Error creating user: ", error);
    throw new Error("Error creating user: " + error);
  }
};

userSchema.statics.createGoogleUser = async function (
  email: string,
  googleId: string
) {
  try {
    const user = new this({ email, googleId });
    await user.save();
    return user;
  } catch (error) {
    console.log("Error creating Google user: ", error);
    throw new Error("Error creating Google user: " + error);
  }
};

userSchema.statics.findByGoogleId = async function (
  googleId: IUser["googleId"]
) {
  return this.findOne({ googleId });
};

userSchema.statics.findOrCreate = async function (profile) {
  try {
    let user = await this.findOne({ googleId: profile.id });
    if (!user) {
      user = new this({ googleId: profile.id, email: profile.emails[0].value });
      await user.save();
    }
    return user;
  } catch (error) {
    console.log("Error finding or creating user: ", error);
    throw new Error("Error finding or creating user: " + error);
  }
};

userSchema.statics.emailExists = async function (email: string) {
  const user = await this.findOne({ email });
  return !!user;
};

userSchema.methods.updatePassword = async function (newPassword: string) {
  this.password = newPassword;
  await this.save();
};

userSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;

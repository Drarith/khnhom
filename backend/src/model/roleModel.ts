import mongoose from "mongoose";

import { Role } from "../types/role.js";
import type { IRole, IRoleModel } from "./types-for-models/roleModel.types.js";

const { Schema } = mongoose;

const roleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: { type: String, enum: Object.values(Role), default: Role.User },
});

roleSchema.statics.createUserRole = async function (userData) {
  try {
    const userRole = new this(userData);
    userRole.save();
  } catch (error) {
    throw new Error("Error creating role for user, " + error);
  }
};
const UserRole = mongoose.model<IRole, IRoleModel>("role", roleSchema);

export default UserRole;

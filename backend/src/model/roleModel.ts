import mongoose from "mongoose";

import { Role } from "../types/role.js";
import type { IRole } from "./types-for-models/roleModel.types.js";

const { Schema } = mongoose;

const roleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: { type: String, enum: Role, default: Role.User },
});

const Profile = mongoose.model<IRole>("role", roleSchema)

export default Profile
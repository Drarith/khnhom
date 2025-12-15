import { Document, Model, Types } from "mongoose";

export interface IRole extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  role: RoleType;
}

type RoleType = "user" | "admin";

export interface IRoleModel extends Model<IRole> {
  createUserRole(userData: unknown): Promise<IRole>;
}

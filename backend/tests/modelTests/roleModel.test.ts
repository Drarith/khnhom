import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserRole from "../../src/model/roleModel.js";
import User from "../../src/model/userModel.js";
import { Role } from "../../src/types/role.js";
import type { IRole } from "../../src/model/types-for-models/roleModel.types.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";

describe("UserRoleModel", () => {
  let mongoServer: MongoMemoryServer;
  let user: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserRole.deleteMany({});
    await User.deleteMany({});
    user = new User({
      email: "test@example.com",
      password: "password123",
    });
    await user.save();
  });

  afterEach(async () => {
    await UserRole.deleteMany({});
    await User.deleteMany({});
  });

  describe("UserRole Schema Validation", () => {
    it("should create a user role with a valid user and role", async () => {
      const roleData = {
        user: user._id,
        role: Role.Admin,
      };

      const userRole = new UserRole(roleData);
      const savedUserRole = await userRole.save();

      expect(savedUserRole.user).toBe(user._id);
      expect(savedUserRole.role).toBe(Role.Admin);
    });

    it("should default to 'User' role if not provided", async () => {
      const roleData = {
        user: user._id,
      };

      const userRole = new UserRole(roleData);
      const savedUserRole = await userRole.save();

      expect(savedUserRole.role).toBe(Role.User);
    });

    it("should require a user", async () => {
      const roleData = {
        role: Role.Admin,
      };

      const userRole = new UserRole(roleData);

      await expect(userRole.save()).rejects.toThrow();
    });

    it("should not allow invalid role values", async () => {
      const roleData = {
        user: user._id,
        role: "InvalidRole",
      };

      const userRole = new UserRole(roleData);

      await expect(userRole.save()).rejects.toThrow();
    });
  });

  describe("createUserRole Static Method", () => {
    it("should create a user role", async () => {
      const roleData = {
        user: user._id,
        role: Role.Admin,
      };

      await UserRole.createUserRole(roleData);

      const foundRole = await UserRole.findOne({ user: user._id });
      expect(foundRole).toBeTruthy();
      expect(foundRole?.role).toBe("admin");
    });
  });
});

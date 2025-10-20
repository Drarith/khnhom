import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";
import userRouter from "../../src/routes/userRoute.js";
import User from "../../src/model/userModel.js";
import type { ProfileCreationInput } from "../../src/types/user-input.types.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";
import Profile from "../../src/model/profileModel.js";
import { execPath } from "process";
import type {
  IProfileModel,
  IProfile,
} from "../../src/model/types-for-models/profileModel.types.js";
import e from "express";

const app = express();
app.use(express.json());
app.use(userRouter);

describe("createUser controller", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});
    testUser = await User.createUser("test1@example.com", "password123");
    // const profileData: ProfileCreationInput = {
    //   user: testUser._id,
    //   username: "testuser",
    //   displayName: "Test User",
    //   bio: "This is a test bio",
    //   profilePictureUrl: "http://example.com/pic.jpg",
    //   paymentQrCodeUrl: "http://example.com/qr.jpg",
    //   socials: { facebook: "testuser" },
    //   theme: "light",
    // };
    // await Profile.createProfile(profileData);
  });

  it("should create a new user with valid email and password", async () => {
    const res = await supertest(app)
      .post("/api/create-user")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body).not.toHaveProperty("password", "password123"); // password should be hashed
    const userInDb = await User.findOne({ email: "test@example.com" });
    expect(userInDb).not.toBeNull();
  });

  it("should not create a user with an existing email", async () => {
    await User.createUser("test@example.com", "password123");
    const res = await supertest(app)
      .post("/api/create-user")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Email already exists/i);
  });

  it("should return 500 if there is a server error", async () => {
    // Simulate error by passing invalid email (violates schema validation)
    const res = await supertest(app)
      .post("/api/create-user")
      .send({ email: "not-an-email", password: "password123" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it("should create a profile for the user", async () => {
    const user = await User.findOne({ email: "test1@example.com" });
    if (!user) throw new Error("User not found");

    const username = "testuser";
    const displayName = "Test User";
    const bio = "This is a test bio";
    const profilePictureUrl = "http://example.com/pic.jpg";
    const paymentQrCodeUrl = "http://example.com/qr.jpg";
    const socials = { facebook: "testuser" };
    const theme = "light";

    const profileData: ProfileCreationInput = {
      user: user._id,
      username: username || "",
      displayName: displayName || "",
      bio: bio || "",
      profilePictureUrl: profilePictureUrl || "",
      paymentQrCodeUrl: paymentQrCodeUrl || "",
      socials: socials || {},
      theme: theme || "",
    };

    await Profile.createProfile(profileData);
    const userProfile = await Profile.findOne({ user: user._id });
    expect(userProfile).toBeDefined();
    expect(userProfile?.displayName).toBe("Test User");
  });

  it("Should update the existing data", async () => {
    // username must match /^[a-zA-Z0-9_]+$/ (no spaces)
    const username = "testuser";
    const displayName = "testName";
    const socials = { facebook: "testuser" };

    const data: ProfileCreationInput = {
      user: testUser._id,
      username: username,
      displayName: displayName,
      socials: socials,
    };
    await Profile.createProfile(data);
    const profileData = (await Profile.findOne({
      user: testUser._id,
    })) as IProfile;
    if (!profileData) throw new Error("No profile found.");
    const updateData = {
      displayName: "New displayName",
      socials: { ...profileData.socials, facebook: "newFacebook" },
    };
    await profileData.updateProfile(updateData);
    expect(profileData.displayName).toBe("New displayName");
  });
});

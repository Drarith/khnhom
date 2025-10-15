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
import Link from "../linkModel.js";
import Profile from "../profileModel.js";
import User from "../userModel.js";
import type { IUser } from "../types-for-models/userModel.types.js";
import type { ProfileCreationInput } from "../../types/user-input.types.js";
import type { IProfile } from "../types-for-models/profileModel.types.js";

describe("LinkModel", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;
  let testProfile: IProfile;
  let testProfileData: ProfileCreationInput;

  beforeAll(async () => {
    // Start in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up: disconnect and stop the server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Profile.deleteMany({});
    await User.deleteMany({});

    // Create a test user for profile tests
    testUser = await User.createUser("test@example.com", "password123");
    testProfileData = {
      user: testUser._id,
      username: "testuser",
      displayName: "Test User",
      bio: "This is a test user.",
      profilePictureUrl: "",
      paymentQrCodeUrl: "",
      socials: {
        facebook: "",
        instagram: "",
        telegram: "",
        youtube: "",
        linkedIn: "",
        x: "",
        tiktok: "",
        github: "",
      },
      theme: "default",
      views: 0,
    };
    testProfile = await Profile.createProfile(testProfileData);
  });

  afterEach(async () => {
    // Clear the database after each test
    await Profile.deleteMany({});
    await User.deleteMany({});
  });

  describe("linkSchemaValidation", () => {
    it("should require title field", async () => {
      const linkData = {
        url: "https://example.com",
        description: "A link for testing",
        owner: testUser._id,
      };

      const link = new Link(linkData);

      await expect(link.save()).rejects.toThrow();
    });

    it("should require url field", async () => {
      const linkData = {
        title: "Test Link",
        description: "A link for testing",
        owner: testUser._id,
      };

      const link = new Link(linkData);

      await expect(link.save()).rejects.toThrow();
    });

    it("should validate url format", async () => {
      const linkData = {
        title: "Test Link",
        url: "invalid-url",
        description: "A link for testing",
        owner: testUser._id,
      };

      const link = new Link(linkData);

      await expect(link.save()).rejects.toThrow();
    });
    
    it("should create and save a valid link", async () => {
      const linkData = {
        title: "Test Link",
        url: "https://example.com",
        description: "A link for testing",
        profile: testProfile._id,
      };

      const link = await Link.createLink(linkData);

      expect(link).toBeDefined();
      expect(link.title).toBe(linkData.title);
      expect(link.url).toBe(linkData.url);
      expect(link.description).toBe(linkData.description);
      expect(link.profile).toBe(linkData.profile);
    });
  });
});

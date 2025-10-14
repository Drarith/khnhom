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
import type { IUser } from "../types/userModel.types.js";

describe("LinkModel", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;

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
  });
});

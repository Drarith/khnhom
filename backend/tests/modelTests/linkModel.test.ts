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
import Link from "../../src/model/linkModel.js";
import Profile from "../../src/model/profileModel.js";
import User from "../../src/model/userModel.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";
import type { ProfileCreationInput } from "../../src/types/user-input.types.js";
import type { IProfile } from "../../src/model/types-for-models/profileModel.types.js";

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
      user: testUser._id.toString(),
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

    describe("creating and update links", () => {
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

      it("should update and save a valid link", async () => {
        const linkData = {
          title: "Test Link",
          url: "https://example.com",
          description: "A link for testing",
          profile: testProfile._id,
        };

        const link = await Link.createLink(linkData);

        expect(link).toBeDefined();

        // Update the link
        link.title = "Updated Test Link";
        link.url = "https://updated-example.com";
        link.description = "An updated link for testing";

        const updatedLink = await link.save();

        expect(updatedLink.title).toBe("Updated Test Link");
        expect(updatedLink.url).toBe("https://updated-example.com");
        expect(updatedLink.description).toBe("An updated link for testing");
        expect(updatedLink.profile).toBe(linkData.profile);
      });

      it("should reject creation of a link with an existing title for the same profile", async () => {
        const linkData = {
          title: "Duplicate Title",
          url: "https://example.com/one",
          description: "First link",
          profile: testProfile._id,
        };

        const first = await Link.createLink(linkData);
        expect(first).toBeDefined();
        expect(first.title).toBe(linkData.title);

        const duplicate = {
          title: "Duplicate Title",
          url: "https://example.com/two",
          description: "Second link with same title",
          profile: testProfile._id,
        };

        await expect(Link.createLink(duplicate)).rejects.toThrow(
          "Link title must be unique"
        );
      });
    });
  });
});

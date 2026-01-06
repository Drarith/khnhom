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
import Profile from "../../src/model/profileModel.js";
import User from "../../src/model/userModel.js";
import type {
  IProfile,
  ISocials,
} from "../../src/model/types-for-models/profileModel.types.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";
import type { ProfileCreationInput } from "../../src/types/user-input.types.js";

describe("ProfileModel", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;
  let testProfile: ProfileCreationInput;

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
    testProfile = {
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
        linkedin: "",
        x: "",
        tiktok: "",
        github: "",
      },
      theme: "default",
      views: 0,
    };
  });

  afterEach(async () => {
    // Clear the database after each test
    await Profile.deleteMany({});
    await User.deleteMany({});
  });

  describe("Profile Schema Validation", () => {
    it("should create a profile with valid data", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser123",
        displayName: "Test User",
        bio: "This is my bio",
        theme: "dark",
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      expect(savedProfile.user.toString()).toBe(testUser._id.toString());
      expect(savedProfile.username).toBe("testuser123");
      expect(savedProfile.displayName).toBe("Test User");
      expect(savedProfile.bio).toBe("This is my bio");
      expect(savedProfile.theme).toBe("dark");
      expect(savedProfile.views).toBe(0);
      expect(savedProfile.createdAt).toBeDefined();
      expect(savedProfile.updatedAt).toBeDefined();
    });

    it("should require user, username, and displayName", async () => {
      const invalidProfiles = [
        { username: "test", displayName: "Test" }, // missing user
        { user: testUser._id, displayName: "Test" }, // missing username
        { user: testUser._id, username: "test" }, // missing displayName
      ];

      for (const data of invalidProfiles) {
        const profile = new Profile(data);
        await expect(profile.save()).rejects.toThrow();
      }
    });

    it("should enforce unique username constraint", async () => {
      await Profile.createProfile(testProfile);

      const user2 = await User.createUser("test2@example.com", "password123");
      const duplicate = {
        ...testProfile,
        user: user2._id.toString(),
      };

      await expect(Profile.createProfile(duplicate)).rejects.toThrow();
    });

    it("should validate username format and length", async () => {
      const invalid = [
        "ab",
        "a".repeat(31),
        "test-user",
        "test user",
        "test@user",
      ];
      const valid = ["testuser", "test_user", "TestUser123"];

      for (const username of invalid) {
        const profile = new Profile({ ...testProfile, username });
        await expect(profile.save()).rejects.toThrow();
      }

      for (const username of valid) {
        await Profile.deleteMany({});
        const profile = new Profile({
          user: testUser._id,
          username,
          displayName: "Test User",
        });
        await expect(profile.save()).resolves.toBeDefined();
      }
    });

    it("should validate displayName length", async () => {
      const tooShort = { ...testProfile, displayName: "ab" };
      const tooLong = { ...testProfile, displayName: "a".repeat(31) };

      await expect(new Profile(tooShort).save()).rejects.toThrow();
      await expect(new Profile(tooLong).save()).rejects.toThrow();
    });

    it("should trim username and displayName whitespace", async () => {
      const profileData = {
        user: testUser._id,
        username: "  testuser  ",
        displayName: "  Test User  ",
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      expect(savedProfile.username).toBe("testuser");
      expect(savedProfile.displayName).toBe("Test User");
    });
  });

  describe("Social Media Links", () => {
    it("should save social media links", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
        socials: {
          facebook: "https://facebook.com/testuser",
          instagram: "https://instagram.com/testuser",
          telegram: "@testuser",
          youtube: "https://youtube.com/@testuser",
          linkedin: "https://linkedin.com/in/testuser",
          x: "https://x.com/testuser",
          tiktok: "https://tiktok.com/@testuser",
          github: "https://github.com/testuser",
        },
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      expect(savedProfile.socials.facebook).toBe(
        "https://facebook.com/testuser"
      );
      expect(savedProfile.socials.instagram).toBe(
        "https://instagram.com/testuser"
      );
      expect(savedProfile.socials.telegram).toBe("@testuser");
      expect(savedProfile.socials.youtube).toBe(
        "https://youtube.com/@testuser"
      );
      expect(savedProfile.socials.linkedin).toBe(
        "https://linkedin.com/in/testuser"
      );
      expect(savedProfile.socials.x).toBe("https://x.com/testuser");
      expect(savedProfile.socials.tiktok).toBe("https://tiktok.com/@testuser");
      expect(savedProfile.socials.github).toBe("https://github.com/testuser");
    });

    it("should save partial social media links", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
        socials: {
          facebook: "https://facebook.com/testuser",
          github: "https://github.com/testuser",
        },
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      expect(savedProfile.socials.facebook).toBe(
        "https://facebook.com/testuser"
      );
      expect(savedProfile.socials.github).toBe("https://github.com/testuser");
      expect(savedProfile.socials.instagram).toBe(""); // Should be default empty
      expect(savedProfile.socials.telegram).toBe(""); // Should be default empty
    });
  });

  describe("incrementViews Method", () => {
    it("should increment views by 1", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      expect(savedProfile.views).toBe(0);

      await savedProfile.incrementViews();
      expect(savedProfile.views).toBe(1);

      await savedProfile.incrementViews();
      expect(savedProfile.views).toBe(2);

      // Verify it's saved in database
      const updatedProfile = await Profile.findById(savedProfile._id);
      expect(updatedProfile?.views).toBe(2);
    });

    it("should increment views multiple times", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
        views: 10, // Starting with some views
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      expect(savedProfile.views).toBe(10);

      for (let i = 0; i < 5; i++) {
        await savedProfile.incrementViews();
      }

      expect(savedProfile.views).toBe(15);

      // Verify it's saved in database
      const updatedProfile = await Profile.findById(savedProfile._id);
      expect(updatedProfile?.views).toBe(15);
    });
  });

  describe("updateSocials Method", () => {
    it("should update specific social media links", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
        socials: {
          facebook: "https://facebook.com/olduser",
          instagram: "https://instagram.com/olduser",
          github: "https://github.com/olduser",
        },
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      // Update only some socials
      await savedProfile.updateSocials({
        facebook: "https://facebook.com/newuser",
        telegram: "@newuser",
      });

      expect(savedProfile.socials.facebook).toBe(
        "https://facebook.com/newuser"
      );
      expect(savedProfile.socials.telegram).toBe("@newuser");
      expect(savedProfile.socials.instagram).toBe(
        "https://instagram.com/olduser"
      ); // Should remain unchanged
      expect(savedProfile.socials.github).toBe("https://github.com/olduser"); // Should remain unchanged

      // Verify it's saved in database
      const updatedProfile = await Profile.findById(savedProfile._id);
      expect(updatedProfile?.socials.facebook).toBe(
        "https://facebook.com/newuser"
      );
      expect(updatedProfile?.socials.telegram).toBe("@newuser");
      expect(updatedProfile?.socials.instagram).toBe(
        "https://instagram.com/olduser"
      );
    });

    it("should update all social media links", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      const newSocials = {
        facebook: "https://facebook.com/testuser",
        instagram: "https://instagram.com/testuser",
        telegram: "@testuser",
        youtube: "https://youtube.com/@testuser",
        linkedin: "https://linkedin.com/in/testuser",
        x: "https://x.com/testuser",
        tiktok: "https://tiktok.com/@testuser",
        github: "https://github.com/testuser",
      };

      await savedProfile.updateSocials(newSocials);

      Object.keys(newSocials).forEach((key) => {
        expect(savedProfile.socials[key as keyof ISocials]).toBe(
          newSocials[key as keyof ISocials]
        );
      });
    });

    it("should clear social media links when set to empty string", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
        socials: {
          facebook: "https://facebook.com/testuser",
          instagram: "https://instagram.com/testuser",
        },
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      // Clear some socials
      await savedProfile.updateSocials({
        facebook: "",
        instagram: "",
      });

      expect(savedProfile.socials.facebook).toBe("");
      expect(savedProfile.socials.instagram).toBe("");
    });
  });

  describe("findByUsername Static Method", () => {
    it("should find profile by username", async () => {
      const profileData = {
        user: testUser._id,
        username: "uniqueuser",
        displayName: "Unique User",
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      const foundProfile = await Profile.findByUsername("uniqueuser");

      expect(foundProfile).toBeTruthy();
      expect(foundProfile?._id.toString()).toBe(savedProfile._id.toString());
      expect(foundProfile?.username).toBe("uniqueuser");
      expect(foundProfile?.displayName).toBe("Unique User");
    });

    it("should return null for non-existent username", async () => {
      const foundProfile = await Profile.findByUsername("nonexistentuser");
      expect(foundProfile).toBeNull();
    });

    it("should be case-sensitive", async () => {
      const profileData = {
        user: testUser._id,
        username: "CaseSensitive",
        displayName: "Case Sensitive User",
      };

      const profile = new Profile(profileData);
      await profile.save();

      const foundProfile1 = await Profile.findByUsername("CaseSensitive");
      const foundProfile2 = await Profile.findByUsername("casesensitive");

      expect(foundProfile1).toBeTruthy();
      expect(foundProfile2).toBeNull();
    });
  });

  describe("Profile Population", () => {
    it("should populate user data", async () => {
      const profileData = {
        user: testUser._id,
        username: "testuser",
        displayName: "Test User",
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      const profileWithUser = await Profile.findById(savedProfile._id).populate(
        "user"
      );

      expect(profileWithUser).toBeTruthy();
      expect(profileWithUser?.user).toBeTruthy();
      // Check that user is populated (should have email property)
      expect((profileWithUser?.user as any).email).toBe("test@example.com");
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete profile lifecycle", async () => {
      // Create profile
      const profileData = {
        user: testUser._id,
        username: "lifecycleuser",
        displayName: "Lifecycle User",
        bio: "Original bio",
        theme: "light",
      };

      const profile = new Profile(profileData);
      const savedProfile = await profile.save();

      // Find by username
      const foundProfile = await Profile.findByUsername("lifecycleuser");
      expect(foundProfile?._id.toString()).toBe(savedProfile._id.toString());

      // Update socials
      await foundProfile?.updateSocials({
        facebook: "https://facebook.com/lifecycleuser",
        github: "https://github.com/lifecycleuser",
      });

      // Increment views
      await foundProfile?.incrementViews();
      await foundProfile?.incrementViews();

      // Verify all changes
      const finalProfile = await Profile.findById(savedProfile._id);
      expect(finalProfile?.socials.facebook).toBe(
        "https://facebook.com/lifecycleuser"
      );
      expect(finalProfile?.socials.github).toBe(
        "https://github.com/lifecycleuser"
      );
      expect(finalProfile?.views).toBe(2);
      expect(finalProfile?.username).toBe("lifecycleuser");
    });

    it("should handle multiple profiles for different users", async () => {
      // Create second user
      const user2 = await User.createUser("test2@example.com", "password123");

      const profile1Data = {
        user: testUser._id,
        username: "user1",
        displayName: "User One",
      };

      const profile2Data = {
        user: user2._id,
        username: "user2",
        displayName: "User Two",
      };

      const profile1 = new Profile(profile1Data);
      const profile2 = new Profile(profile2Data);

      const savedProfile1 = await profile1.save();
      const savedProfile2 = await profile2.save();

      // Both should exist independently
      const foundProfile1 = await Profile.findByUsername("user1");
      const foundProfile2 = await Profile.findByUsername("user2");

      expect(foundProfile1?._id.toString()).toBe(savedProfile1._id.toString());
      expect(foundProfile2?._id.toString()).toBe(savedProfile2._id.toString());

      expect(foundProfile1?.user.toString()).toBe(testUser._id.toString());
      expect(foundProfile2?.user.toString()).toBe(user2._id.toString());
    });
  });
});

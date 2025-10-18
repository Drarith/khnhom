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
import User from "../../src/model/userModel.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";

describe("UserModel", () => {
  let mongoServer: MongoMemoryServer;
  let user: IUser;

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
    await User.deleteMany({});
  });

  afterEach(async () => {
    // Clear the database after each test
    await User.deleteMany({});
  });

  describe("User Schema Validation", () => {
    it("should create a user with valid email and password", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.email).toBe("test@example.com");
      expect(savedUser.password).not.toBe("password123"); // Should be hashed
      expect(savedUser.isSupporter).toBe(false); // Default value
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it("should validate email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "password123",
      };

      user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it("should enforce minimum password length", async () => {
      const userData = {
        email: "test@example.com",
        password: "123", // Too short
      };

      user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it("should enforce unique email constraint", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      // Create first user
      user = new User(userData);
      await user.save();

      // Try to create second user with same email
      const user2: IUser = new User(userData);

      await expect(user2.save()).rejects.toThrow();
    });

    it("should convert email to lowercase", async () => {
      const userData = {
        email: "TEST@EXAMPLE.COM",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.email).toBe("test@example.com");
    });

    it("should trim email whitespace", async () => {
      const userData = {
        email: "  test@example.com  ",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.email).toBe("test@example.com");
    });

    it("should allow unique googleId", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        googleId: "google123",
      };

      user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.googleId).toBe("google123");
    });

    it("should enforce unique googleId constraint", async () => {
      const userData1 = {
        email: "test1@example.com",
        password: "password123",
        googleId: "google123",
      };

      const userData2 = {
        email: "test2@example.com",
        password: "password123",
        googleId: "google123", // Same googleId
      };

      // Create first user
      const user1: IUser = new User(userData1);
      await user1.save();

      // Try to create second user with same googleId
      const user2: IUser = new User(userData2);

      await expect(user2.save()).rejects.toThrow();
    });
  });

  describe("Password Hashing Pre-save Middleware", () => {
    it("should hash password before saving", async () => {
      const plainPassword = "password123";
      const userData = {
        email: "test@example.com",
        password: plainPassword,
      };

      user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(plainPassword);
      expect(savedUser.password.length).toBeGreaterThan(plainPassword.length);
    });

    it("should not rehash password if not modified", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();
      const originalHashedPassword = savedUser.password;

      // Update a different field
      savedUser.isSupporter = true;
      const updatedUser = await savedUser.save();

      expect(updatedUser.password).toBe(originalHashedPassword);
    });

    it("should rehash password when modified", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();
      const originalHashedPassword = savedUser.password;

      // Update the password
      savedUser.password = "newpassword123";
      const updatedUser = await savedUser.save();

      expect(updatedUser.password).not.toBe(originalHashedPassword);
    });
  });

  describe("comparePassword Method", () => {
    it("should return true for correct password", async () => {
      const plainPassword = "password123";
      const userData = {
        email: "test@example.com",
        password: plainPassword,
      };

      user = new User(userData);
      const savedUser = await user.save();

      const isMatch = await savedUser.comparePassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();

      const isMatch = await savedUser.comparePassword("wrongpassword");
      expect(isMatch).toBe(false);
    });
  });

  describe("createUser Static Method", () => {
    it("should create and save a user", async () => {
      const email = "test@example.com";
      const password = "password123";

      user = await User.createUser(email, password);

      expect(user.email).toBe(email);
      expect(user.password).not.toBe(password); // Should be hashed
      expect(user._id).toBeDefined();

      // Verify it was saved to database
      const foundUser = await User.findById(user._id);
      expect(foundUser).toBeTruthy();
      expect(foundUser?.email).toBe(email);
    });

    it("should throw error when creating user with duplicate email", async () => {
      const email = "test@example.com";
      const password = "password123";

      // Create first user
      await User.createUser(email, password);

      // Try to create second user with same email
      await expect(User.createUser(email, password)).rejects.toThrow();
    });

    it("should throw error when creating user with invalid data", async () => {
      const email = "invalid-email";
      const password = "password123";

      await expect(User.createUser(email, password)).rejects.toThrow();
    });
  });

  describe("findByGoogleId Static Method", () => {
    it("should find user by googleId", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        googleId: "google123",
      };

      user = new User(userData);
      const savedUser = await user.save();

      const foundUser = await User.findByGoogleId("google123");

      expect(foundUser).toBeTruthy();
      expect(foundUser?._id.toString()).toBe(savedUser._id.toString());
      expect(foundUser?.googleId).toBe("google123");
    });

    it("should return null for non-existent googleId", async () => {
      const foundUser = await User.findByGoogleId("nonexistent");
      expect(foundUser).toBeNull();
    });
  });

  describe("emailExists Static Method", () => {
    it("should return true if email exists", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      await user.save();

      const exists = await User.emailExists("test@example.com");
      expect(exists).toBe(true);
    });

    it("should return false if email does not exist", async () => {
      const exists = await User.emailExists("nonexistent@example.com");
      expect(exists).toBe(false);
    });

    it("should be case-insensitive", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      await user.save();

      const exists = await User.emailExists("TEST@EXAMPLE.COM");
      expect(exists).toBe(true);
    });
  });

  describe("updatePassword Method", () => {
    it("should update and hash new password", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();
      const originalPassword = savedUser.password;

      await savedUser.updatePassword("newpassword123");

      expect(savedUser.password).not.toBe(originalPassword);
      expect(savedUser.password).not.toBe("newpassword123"); // Should be hashed

      // Verify new password works
      const isMatch = await savedUser.comparePassword("newpassword123");
      expect(isMatch).toBe(true);

      // Verify old password no longer works
      const oldMatch = await savedUser.comparePassword("password123");
      expect(oldMatch).toBe(false);
    });
  });

  describe("findByEmail Static Method", () => {
    it("should find user by email", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      const savedUser = await user.save();

      const foundUser = await User.findByEmail("test@example.com");

      expect(foundUser).toBeTruthy();
      expect(foundUser?._id.toString()).toBe(savedUser._id.toString());
      expect(foundUser?.email).toBe("test@example.com");
    });

    it("should return null for non-existent email", async () => {
      const foundUser = await User.findByEmail("nonexistent@example.com");
      expect(foundUser).toBeNull();
    });

    it("should be case-insensitive", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      user = new User(userData);
      await user.save();

      const foundUser = await User.findByEmail("TEST@EXAMPLE.COM");
      expect(foundUser).toBeTruthy();
      expect(foundUser?.email).toBe("test@example.com"); // Should be stored as lowercase
    });
  });

  describe("Google-related Static Methods", () => {
    it("should create a google user with createGoogleUser", async () => {
      const email = "googleuser@example.com";
      const googleId = "google-unique-123";

      const created = await User.createGoogleUser(email, googleId);

      expect(created).toBeDefined();
      expect(created.email).toBe(email);
      expect(created.googleId).toBe(googleId);

      // Verify saved to DB
      const found = await User.findById(created._id);
      expect(found).toBeTruthy();
      expect(found?.googleId).toBe(googleId);
    });

    it("findOrCreate should find existing user by profile or create new one", async () => {
      const profile = {
        id: "profile-google-456",
        emails: [{ value: "profile@example.com" }],
      } as any;

      // Ensure no user exists yet
      let pre = await User.findByGoogleId(profile.id);
      expect(pre).toBeNull();

      // First call should create
      const first = await User.findOrCreate(profile);
      expect(first).toBeDefined();
      expect(first.googleId).toBe(profile.id);
      expect(first.email).toBe(profile.emails[0].value);

      // Second call should find the same user
      const second = await User.findOrCreate(profile);
      expect(second).toBeDefined();
      expect(second._id.toString()).toBe(first._id.toString());
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete user lifecycle", async () => {
      // Create user
      const email = "lifecycle@example.com";
      const password = "password123";
      const newPassword = "newpassword456";

      user = await User.createUser(email, password);
      expect(user.email).toBe(email);

      // Verify email exists
      const emailExists = await User.emailExists(email);
      expect(emailExists).toBe(true);

      // Find by email
      const foundUser = await User.findByEmail(email);
      expect(foundUser?._id.toString()).toBe(user._id.toString());

      // Verify password
      const isCorrectPassword = await foundUser?.comparePassword(password);
      expect(isCorrectPassword).toBe(true);

      // Update password
      await foundUser?.updatePassword(newPassword);

      // Verify new password works
      const isNewPasswordCorrect = await foundUser?.comparePassword(
        newPassword
      );
      expect(isNewPasswordCorrect).toBe(true);

      // Verify old password no longer works
      const isOldPasswordCorrect = await foundUser?.comparePassword(password);
      expect(isOldPasswordCorrect).toBe(false);
    });

    it("should handle user with googleId", async () => {
      const userData = {
        email: "google@example.com",
        password: "password123",
        googleId: "google123456",
      };

      user = new User(userData);
      const savedUser = await user.save();

      // Find by googleId
      const foundByGoogleId = await User.findByGoogleId("google123456");
      expect(foundByGoogleId?._id.toString()).toBe(savedUser._id.toString());

      // Find by email should also work
      const foundByEmail = await User.findByEmail("google@example.com");
      expect(foundByEmail?._id.toString()).toBe(savedUser._id.toString());
      expect(foundByEmail?.googleId).toBe("google123456");
    });
  });
});

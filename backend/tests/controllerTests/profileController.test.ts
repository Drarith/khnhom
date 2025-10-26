import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";
import jwt from "jsonwebtoken"; // <-- added
import profileRouter from "../../src/routes/profileRoute.js";
import User from "../../src/model/userModel.js";
import Profile from "../../src/model/profileModel.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";
import type {
  LinkCreationInput,
  ProfileCreationInput,
} from "../../src/types/user-input.types.js";

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  // Directly set req.user for authenticated routes
  if (req.headers.authorization) {
    const userId = req.headers.authorization;
    req.user = { id: userId };
  }
  next();
});

app.use(profileRouter);

describe("Profile Routes", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Ensure a JWT secret exists for authenticateToken middleware
    process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});
    testUser = await User.createUser("test@example.com", "password123");
  });

  describe("POST /api/create-profile", () => {
    it("should create a new profile for an authenticated user", async () => {
      const links = [{title:"test", url:"testtest.com"},{title:"test2", url:"test3.com"}]
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Test User",
        bio: "This is a test bio.",
        links:links
      };

      const token = jwt.sign(
        {
          id: testUser._id.toString(),
          email: (testUser.email as string) || "test@example.com",
        },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/create-profile")
        .set("Authorization", `Bearer ${token}`) 
        .send(profileData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Profile created successfully!");

      const profileInDb = await Profile.findOne({ user: testUser._id });
      expect(profileInDb).not.toBeNull();
      expect(profileInDb?.username).toBe("testuser");
      expect(profileInDb?.links).toBeDefined()
    });

    it("should return 401 if user is not authenticated", async () => {
      const profileData = {
        username: "testuser",
        displayName: "Test User",
      };

      const res = await supertest(app)
        .post("/api/create-profile")
        .send(profileData);

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/profile/:username", () => {
    it("should return a profile by username", async () => {
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Test User",
      };
      await Profile.createProfile(profileData);

      const res = await supertest(app).get("/api/profile/testuser");

      expect(res.status).toBe(200);
      expect(res.body.username).toBe("testuser");
    });

    it("should return 404 if profile is not found", async () => {
      const res = await supertest(app).get("/api/profile/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/profile/:username/links", () => {
    it("should return links for a profile", async () => {
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Test User",
      };
      const profile = await Profile.createProfile(profileData);

      await profile.addLink({ title: "Link 1", url: "https://link1.com" });

      const res = await supertest(app).get("/api/profile/testuser/links");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe("Link 1");
    });
  });

  describe("POST /api/create-link", () => {
    it("should create a new link for an authenticated user", async () => {
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Test User",
      };
      const newProfile = await Profile.createProfile(profileData);

      const linkData: LinkCreationInput = {
        profile: newProfile._id,
        title: "New Link",
        url: "https://newlink.com",
      };

      // Create token and pass it as Bearer token
      const token = jwt.sign(
        {
          id: testUser._id.toString(),
          email: (testUser.email as string) || "test@example.com",
        },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/create-link")
        .set("Authorization", `Bearer ${token}`) // <-- changed to Bearer token
        .send(linkData);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Added successfully.");
    });
  });
});

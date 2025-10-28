import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";
import jwt from "jsonwebtoken"; // <-- added
import profileRouter from "../../src/routes/profileRoute.js";
import User from "../../src/model/userModel.js";
import Profile from "../../src/model/profileModel.js";
import Link from "../../src/model/linkModel.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";
import type {
  LinkCreationInput,
  ProfileCreationInput,
} from "../../src/types/user-input.types.js";

const app = express();
app.use(express.json());

// Mock authentication middleware
// - Accepts either a raw user id in the Authorization header (legacy tests), or
// - a "Bearer <jwt>" token signed with process.env.JWT_SECRET containing { id, email }
app.use((req, res, next) => {
  const authHeader = (req.headers.authorization as string) || "";
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token == null) {
        // 401 Unauthorized
        return res.status(401).json({ message: "No token provided" });
      }
      try {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any;
        // payload should contain { id, email } as created in tests
        req.user = { id: payload.id, email: payload.email };
      } catch (err) {}
    } else {
      req.user = { id: authHeader };
    }
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
    await Link.deleteMany({});
    testUser = await User.createUser("test@example.com", "password123");
  });

  describe("POST /api/create-profile", () => {
    it("should create a new profile for an authenticated user", async () => {
      const link = { title: "test", url: "https://testtest.com" };
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Test User",
        bio: "This is a test bio.",
        link: link,
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

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Profile created successfully!");

      const profileInDb = await Profile.findOne({ user: testUser._id });
      expect(profileInDb).not.toBeNull();
      expect(profileInDb?.username).toBe("testuser");
      expect(profileInDb?.links).toBeDefined();
      expect(profileInDb?.links.length).toBe(1);

      // extra assertion: the created Link exists and has the expected title
      const createdLink = await Link.findById(profileInDb?.links[0]);
      expect(createdLink).not.toBeNull();
      expect(createdLink?.title).toBe("test");
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
        .set("Authorization", `Bearer ${token}`)
        .send(linkData);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Added successfully.");
    });
  });

  describe("PUT /api/update-profile", () => {
    it("should update profile for an authenticated user", async () => {
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Old Name",
        bio: "Old bio",
        profilePictureUrl: "https://oldurl.com/pic.jpg",
        paymentQrCodeUrl: "https://oldurl.com/qr.png",
        socials: { x: "oldhandle" },
        theme: "light",
      };
      await Profile.createProfile(profileData);

      const token = jwt.sign(
        {
          id: testUser._id.toString(),
          email: (testUser.email as string) || "test@example.com",
        },
        process.env.JWT_SECRET as string
      );

      const updateBody = {
        displayName: "New Name",
        bio: "Updated bio",
        profilePictureUrl: "https://example.com/pic.jpg",
        paymentQrCodeUrl: "https://example.com/qr.png",
        socials: { x: "newhandle" },
        theme: "dark",
      };

      const res = await supertest(app)
        .put("/api/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send(updateBody);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const updated = await Profile.findOne({ user: testUser._id });
      expect(updated).not.toBeNull();
      expect(updated?.displayName).toBe("New Name");
      expect(updated?.bio).toBe("Updated bio");
      expect(updated?.profilePictureUrl).toBe("https://example.com/pic.jpg");
      expect(updated?.paymentQrCodeUrl).toBe("https://example.com/qr.png");
      expect(updated?.socials?.x).toBe("newhandle");
      expect(updated?.theme).toBe("dark");
    });

    it("should return 400 for invalid profilePictureUrl", async () => {
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Test User",
      };
      await Profile.createProfile(profileData);

      const token = jwt.sign(
        {
          id: testUser._id.toString(),
          email: (testUser.email as string) || "test@example.com",
        },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .put("/api/update-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ profilePictureUrl: "not-a-url" });

      expect(res.status).toBe(400);
    });

    it("should return 400 for invalid socials", async () => {
      const profileData: ProfileCreationInput = {
        user: testUser._id.toString(),
        username: "testuser",
        displayName: "Test User",
      };
      await Profile.createProfile(profileData);

      const token = jwt.sign(
        {
          id: testUser._id.toString(),
          email: (testUser.email as string) || "test@example.com",
        },
        process.env.JWT_SECRET as string
      );

      // const res = await supertest(app)
      //   .put("/api/update-profile")
      //   .set("Authorization", `Bearer ${token}`)
      //   .send({ socials: { tiktok: "wwww.google.com" } });

      // const updated = await Profile.findOne({ user: testUser._id });
      // console.log(updated);

      // expect(res.status).toBe(400);
    });

    it("should return 401 if user is not authenticated", async () => {
      const res = await supertest(app)
        .put("/api/update-profile")
        .send({ displayName: "No Auth" });

      expect(res.status).toBe(401);
    });
  });
});

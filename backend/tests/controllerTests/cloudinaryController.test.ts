import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import User from "../../src/model/userModel.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";

// Mock cloudinary
vi.mock("cloudinary", () => ({
  v2: {
    utils: {
      api_sign_request: vi.fn().mockReturnValue("mock-signature"),
    },
  },
}));

// Mock env
vi.mock("../../src/config/myEnv.js", () => ({
  env: {
    CLOUDINARY_API_SECRET: "mock-secret",
  },
}));

const app = express();
app.use(express.json());

// Mock auth middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization as string;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;
      req.user = { id: payload.id, email: payload.email };
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
  next();
});

const { cloudinaryUploadSignature } = await import(
  "../../src/controllers/cloudinaryController.js"
);

app.post("/api/cloudinary-signature", cloudinaryUploadSignature);

describe("Cloudinary Controller", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = await User.createUser("test@example.com", "password123");
  });

  describe("POST /api/cloudinary-signature", () => {
    it("should generate upload signature for authenticated user", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/cloudinary-signature")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("signature");
      expect(res.body).toHaveProperty("timestamp");
      expect(res.body.publicId).toContain(`user_${testUser._id}`);
    });

    it("should reject unauthenticated requests", async () => {
      const res = await supertest(app).post("/api/cloudinary-signature");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthorized");
    });

    it("should generate unique public_id per user", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/cloudinary-signature")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.publicId).toBe(`user_${testUser._id}_profile`);
    });

    it("should include timestamp in response", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const before = Math.round(Date.now() / 1000);

      const res = await supertest(app)
        .post("/api/cloudinary-signature")
        .set("Authorization", `Bearer ${token}`);

      const after = Math.round(Date.now() / 1000);

      expect(res.body.timestamp).toBeGreaterThanOrEqual(before);
      expect(res.body.timestamp).toBeLessThanOrEqual(after);
    });

    it("should reject invalid token", async () => {
      const invalidToken = "invalid.token.here";

      const res = await supertest(app)
        .post("/api/cloudinary-signature")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(res.status).toBe(403);
    });
  });
});

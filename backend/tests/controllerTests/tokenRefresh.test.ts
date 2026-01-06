import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../../src/model/userModel.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";
import { generateTokens } from "../../src/utils/tokenUtils.js";
import { refreshAccessToken } from "../../src/controllers/userController.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/api/auth/refresh-token", refreshAccessToken);

describe("Token Refresh", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
    process.env.REFRESH_TOKEN_SECRET =
      process.env.REFRESH_TOKEN_SECRET || "refreshsecret";
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = await User.createUser("test@example.com", "password123");
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should refresh access token with valid refresh token", async () => {
      const { refreshToken } = generateTokens(testUser);
      await testUser.updateRefreshToken(refreshToken);

      const res = await supertest(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", [`refresh_token=${refreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Tokens refreshed successfully");

      const cookies = res.headers["set-cookie"] as string[];
      const hasAccessToken = cookies.some((c) => c.startsWith("access_token="));
      expect(hasAccessToken).toBe(true);
    });

    it("should reject invalid refresh token", async () => {
      const invalidToken = jwt.sign(
        { id: "invalid", email: "test@example.com" },
        "wrong-secret"
      );

      const res = await supertest(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", [`refresh_token=${invalidToken}`]);

      expect(res.status).toBe(403);
    });

    it("should reject when no refresh token provided", async () => {
      const res = await supertest(app).post("/api/auth/refresh-token");

      expect(res.status).toBe(401);
      expect(res.body.message).toContain("Refresh token not provided");
    });

    it("should reject when refresh token doesn't match stored token", async () => {
      const { refreshToken: token1 } = generateTokens(testUser);
      const testUser2 = await User.createUser(
        "test2@example.com",
        "password123"
      );
      const { refreshToken: token2 } = generateTokens(testUser2);

      // Store token1 for testUser but send token2 (different user's token)
      await testUser.updateRefreshToken(token1);

      const res = await supertest(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", [`refresh_token=${token2}`]);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("Invalid refresh token");
    });

    it("should reject when user doesn't exist", async () => {
      const fakeUser = {
        _id: new mongoose.Types.ObjectId(),
        email: "fake@example.com",
      } as IUser;

      const { refreshToken } = generateTokens(fakeUser);

      const res = await supertest(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", [`refresh_token=${refreshToken}`]);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("User not found");
    });

    it("should issue new refresh token and update database", async () => {
      const { refreshToken: oldToken } = generateTokens(testUser);
      await testUser.updateRefreshToken(oldToken);

      // Get current stored token
      const userBefore = await User.findById(testUser._id);
      const storedTokenBefore = userBefore?.refreshToken;

      const res = await supertest(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", [`refresh_token=${oldToken}`]);

      expect(res.status).toBe(200);

      // Get new refresh token from cookies
      const cookies = res.headers["set-cookie"] as string[];
      const refreshCookie = cookies.find((c) => c.startsWith("refresh_token="));
      expect(refreshCookie).toBeDefined();

      // Verify database was updated with new token (different from old)
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser?.refreshToken).toBeDefined();
      expect(updatedUser?.refreshToken).not.toBe(storedTokenBefore); // Should be rotated
    });

    it("should set httpOnly cookies", async () => {
      const { refreshToken } = generateTokens(testUser);
      await testUser.updateRefreshToken(refreshToken);

      const res = await supertest(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", [`refresh_token=${refreshToken}`]);

      const cookies = res.headers["set-cookie"] as string[];
      const accessCookie = cookies.find((c) => c.startsWith("access_token="));
      const refreshCookie = cookies.find((c) => c.startsWith("refresh_token="));

      expect(accessCookie).toContain("HttpOnly");
      expect(refreshCookie).toContain("HttpOnly");
    });
  });
});

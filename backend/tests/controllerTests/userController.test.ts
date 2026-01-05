import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";
import userRouter from "../../src/routes/userRoute.js";
import User from "../../src/model/userModel.js";
import UserRole from "../../src/model/roleModel.js";

const app = express();
app.use(express.json());
app.use(userRouter);

function getCookies(res: supertest.Response): string[] {
  const raw = (res.headers["set-cookie"] as string[] | undefined) ?? [];
  return Array.isArray(raw) ? raw : [raw].filter(Boolean);
}

function hasAuthCookie(cookies: string[]) {
  return cookies.some((c) => c.startsWith("auth_token="));
}

describe("User Routes", () => {
  let mongoServer: MongoMemoryServer;

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
    await UserRole.deleteMany({});
  });

  describe("POST /api/create-user", () => {
    it("should create a new user, set an HttpOnly auth cookie, and return 201", async () => {
      const res = await supertest(app)
        .post("/api/create-user")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created successfully.");

      const cookies = getCookies(res);
      expect(Array.isArray(cookies)).toBe(true);
      expect(hasAuthCookie(cookies)).toBe(true);

      // Cookie attributes (don’t enforce Secure in test env)
      const authCookie = cookies.find((c) => c.startsWith("auth_token="))!;
      expect(authCookie).toMatch(/HttpOnly/i);
      expect(authCookie).toMatch(/SameSite=Lax/i);
      expect(authCookie).toMatch(/Max-Age=/i);

      // DB should have the user
      const userInDb = await User.findOne({ email: "test@example.com" });
      expect(userInDb).not.toBeNull();
    });

    it("should create a user role for the new user", async () => {
      await supertest(app)
        .post("/api/create-user")
        .send({ email: "test@example.com", password: "password123" });

      const user = await User.findOne({ email: "test@example.com" });
      const userRole = await UserRole.findOne({ user: user?._id });
      expect(userRole).not.toBeNull();
      expect(userRole?.role).toBe("user");
    });

    it("should not create a user with an existing email", async () => {
      await User.createUser("test@example.com", "password123");

      const res = await supertest(app)
        .post("/api/create-user")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "Email already exists, please log in instead."
      );
    });
  });

  describe("POST /api/login", () => {
    it("should login a user, set an HttpOnly auth cookie, and return 200", async () => {
      await User.createUser("test@example.com", "password123");

      const res = await supertest(app)
        .post("/api/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged in successfully.");

      const cookies = getCookies(res);
      expect(hasAuthCookie(cookies)).toBe(true);
      const authCookie = cookies.find((c) => c.startsWith("auth_token="))!;
      expect(authCookie).toMatch(/HttpOnly/i);
      expect(authCookie).toMatch(/SameSite=Lax/i);
      expect(authCookie).toMatch(/Max-Age=/i);

      // No token should be returned in body anymore
      expect(res.body.token).toBeUndefined();
    });

    it("should not login a user with incorrect credentials", async () => {
      await User.createUser("test@example.com", "password123");

      const res = await supertest(app)
        .post("/api/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/logout", () => {
    it("should clear the auth cookie and return 200", async () => {
      const res = await supertest(app).get("/api/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out. Cookie cleared.");

      const cookies = getCookies(res);
      const cleared = cookies.find((c) => c.startsWith("auth_token="));
      expect(cleared).toBeDefined();
      // Clearing should set Max-Age=0 or an Expires in the past
      expect(cleared).toMatch(/Max-Age=0|Expires=/i);
      expect(cleared).toMatch(/HttpOnly/i);
      expect(cleared).toMatch(/SameSite=Lax/i);
    });


  });
});

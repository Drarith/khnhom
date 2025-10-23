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
    it("should create a new user with a valid email and password", async () => {
      const res = await supertest(app)
        .post("/api/create-user")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe("test@example.com");

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
      expect(res.body.error).toBe("Email already exists, please log in instead.");
    });
  });

  describe("POST /api/login", () => {
    it("should login a user with correct credentials", async () => {
      await User.createUser("test@example.com", "password123");

      const res = await supertest(app)
        .post("/api/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged in successfully.");
      expect(res.body.token).toBeDefined();
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
    it("should logout a user", async () => {
        const res = await supertest(app).get("/api/logout");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully logged out. Please remove the token from your client.");
    });
  });
});

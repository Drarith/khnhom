import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";
import userRouter from "../../src/routes/userRoute.js";
import User from "../../src/model/userModel.js";

const app = express();
app.use(express.json());
app.use(userRouter);

describe("createUser controller", () => {
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
  });

  it("should create a new user with valid email and password", async () => {
    const res = await supertest(app)
      .post("/api/create-user")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body).not.toHaveProperty("password", "password123"); // password should be hashed
    const userInDb = await User.findOne({ email: "test@example.com" });
    expect(userInDb).not.toBeNull();
  });

  it("should not create a user with an existing email", async () => {
    await User.createUser("test@example.com", "password123");
    const res = await supertest(app)
      .post("/api/create-user")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Email already exists/i);
  });

  it("should return 500 if there is a server error", async () => {
    // Simulate error by passing invalid email (violates schema validation)
    const res = await supertest(app)
      .post("/api/create-user")
      .send({ email: "not-an-email", password: "password123" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});

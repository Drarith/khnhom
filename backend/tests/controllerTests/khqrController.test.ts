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
import Profile from "../../src/model/profileModel.js";
import User from "../../src/model/userModel.js";
import type { IUser } from "../../src/model/types-for-models/userModel.types.js";

// Mock BakongKHQR
const mockDecode = vi.fn().mockReturnValue({
  data: {
    merchantName: "Test Merchant",
    merchantCity: "Phnom Penh",
    transactionCurrency: "840",
    transactionAmount: "10.00",
  },
});

vi.mock("bakong-khqr", () => ({
  BakongKHQR: class {
    static decode = mockDecode;
    generateIndividual = vi.fn().mockReturnValue({
      data: {
        qr: "mock-qr-string",
        md5: "mock-md5-hash",
      },
    });
    generateMerchant = vi.fn().mockReturnValue({
      data: {
        qr: "mock-qr-string",
        md5: "mock-md5-hash",
      },
    });
  },
  khqrData: {
    currency: {
      khr: "116",
      usd: "840",
    },
  },
  IndividualInfo: vi.fn(),
  MerchantInfo: vi.fn(),
}));

// Mock QRCode
vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,mockbase64"),
  },
}));

// Mock Cloudinary upload
vi.mock("../../src/https/uploadToCloudinary.js", () => ({
  uploadBase64ToCloudinary: vi.fn().mockResolvedValue({
    secure_url: "https://cloudinary.com/mock-qr.png",
  }),
}));

// Mock axios for Bakong API
vi.mock("axios", () => ({
  default: {
    post: vi.fn().mockResolvedValue({
      data: {
        responseCode: 0,
        data: {
          amount: 10,
          currency: "USD",
        },
      },
    }),
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

// Need to import after mocks
const { createKHQR, createKHQRForDonation } = await import(
  "../../src/controllers/khqrController.js"
);

// Add profile to request
app.use(async (req, res, next) => {
  if (req.user) {
    const profile = await Profile.findOne({ user: req.user.id });
    req.profile = profile;
  }
  next();
});

app.post("/api/user/generate-khqr", createKHQR);
app.post("/api/user/generate-donation-khqr", createKHQRForDonation);

describe("KHQR Controller", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: IUser;
  let testProfile: any;

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
    await Profile.deleteMany({});

    testUser = await User.createUser("test@example.com", "password123");
    testProfile = await Profile.createProfile({
      user: testUser._id.toString(),
      username: "testuser",
      displayName: "Test User",
    });
  });

  describe("POST /api/user/generate-khqr", () => {
    it("should generate individual KHQR code", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const khqrData = {
        accountType: "individual",
        bakongAccountID: "testuser@aclb",
        merchantName: "Test Merchant",
        merchantCity: "Phnom Penh",
      };

      const res = await supertest(app)
        .post("/api/user/generate-khqr")
        .set("Authorization", `Bearer ${token}`)
        .send(khqrData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject missing account type", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/user/generate-khqr")
        .set("Authorization", `Bearer ${token}`)
        .send({
          bakongAccountID: "testuser@aclb",
          merchantName: "Test",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Account type is required");
    });

    it("should reject invalid account type", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/user/generate-khqr")
        .set("Authorization", `Bearer ${token}`)
        .send({
          accountType: "invalid",
          bakongAccountID: "test@aclb",
          merchantName: "Test",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Invalid account type");
    });

    it("should reject missing mandatory fields for individual", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/user/generate-khqr")
        .set("Authorization", `Bearer ${token}`)
        .send({
          accountType: "individual",
          bakongAccountID: "test@aclb",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Missing mandatory fields");
    });

    it("should reject unauthorized requests", async () => {
      const res = await supertest(app).post("/api/user/generate-khqr").send({
        accountType: "individual",
        bakongAccountID: "test@aclb",
        merchantName: "Test",
      });

      expect(res.status).toBe(401);
    });

    it("should reject when profile not found", async () => {
      const userWithoutProfile = await User.createUser(
        "noprofile@example.com",
        "password123"
      );
      const token = jwt.sign(
        {
          id: userWithoutProfile._id.toString(),
          email: userWithoutProfile.email,
        },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/user/generate-khqr")
        .set("Authorization", `Bearer ${token}`)
        .send({
          accountType: "individual",
          bakongAccountID: "test@aclb",
          merchantName: "Test",
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("Profile not found");
    });
  });

  describe("POST /api/user/generate-donation-khqr", () => {
    it("should generate donation QR code", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/user/generate-donation-khqr")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: "10.50" });

      expect(res.status).toBe(200);
      expect(res.body.qrData).toBeDefined();
    });

    it("should reject missing amount", async () => {
      const token = jwt.sign(
        { id: testUser._id.toString(), email: testUser.email },
        process.env.JWT_SECRET as string
      );

      const res = await supertest(app)
        .post("/api/user/generate-donation-khqr")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });
});

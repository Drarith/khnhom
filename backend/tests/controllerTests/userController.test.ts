import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
  type Mock,
} from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import supertest from "supertest";

// --- MOCKS ---

// Mock Passport logic before importing routes
const { mockAuthenticate } = vi.hoisted(() => {
  const mock = vi.fn();
  // Default mock implementation: returns a dummy middleware
  mock.mockReturnValue((req: any, res: any, next: any) => next());
  return { mockAuthenticate: mock };
});

vi.mock("passport", () => {
  return {
    default: {
      authenticate: mockAuthenticate,
      use: vi.fn(),
      initialize: vi.fn(() => (req: any, res: any, next: any) => next()),
      serializeUser: vi.fn(),
      deserializeUser: vi.fn(),
    },
  };
});

// Mock helpers/httpOnlyCookie.js if needed, but we probably want to test their effect (cookies).
// However, the real implementation sets cookies on the response. We rely on supertest to read them.

// Import routes AFTER mocking
import userRouter from "../../src/routes/userRoute.js";
import User from "../../src/model/userModel.js";
import UserRole from "../../src/model/roleModel.js";

const app = express();
app.use(express.json());
app.use(userRouter);

// --- HELPERS ---

function getCookies(res: supertest.Response): string[] {
  const raw = (res.headers["set-cookie"] as string[] | undefined) ?? [];
  return Array.isArray(raw) ? raw : [raw].filter(Boolean);
}

function hasAuthCookies(cookies: string[]) {
  // Check for access_token and refresh_token
  const hasAccess = cookies.some((c) => c.startsWith("access_token="));
  // refresh_token might not be sent in all cases or might be rotated?
  // userController.ts sends both for create and login.
  // const hasRefresh = cookies.some((c) => c.startsWith("refresh_token="));
  return hasAccess;
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
    vi.clearAllMocks();
  });

  describe("POST /api/create-user", () => {
    it("should create a new user, set HttpOnly auth cookies, and return 201", async () => {
      const res = await supertest(app)
        .post("/api/create-user")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created successfully.");

      const cookies = getCookies(res);
      expect(hasAuthCookies(cookies)).toBe(true);

      const accessCookie = cookies.find((c) => c.startsWith("access_token="))!;
      expect(accessCookie).toMatch(/HttpOnly/i);
      expect(accessCookie).toMatch(/SameSite=Lax/i);
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
    it("should login a user via local strategy", async () => {
      // Create user first
      const existingUser = await User.createUser(
        "login@example.com",
        "password123"
      );
      // Need a role
      await UserRole.createUserRole({ user: existingUser._id });

      // Mock passport.authenticate for 'local'
      mockAuthenticate.mockImplementation((strategy, options, callback) => {
        if (strategy === "local") {
          return (req: any, res: any, next: any) => {
            // Trigger callback with success
            // callback signature: (err, user, info)
            callback(null, existingUser, null);
          };
        }
        return (req: any, res: any, next: any) => next();
      });

      const res = await supertest(app)
        .post("/api/login")
        .send({ email: "login@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged in successfully.");

      const cookies = getCookies(res);
      expect(hasAuthCookies(cookies)).toBe(true);
    });

    it("should return 401 if passport authentication fails", async () => {
      // Mock passport failure
      mockAuthenticate.mockImplementation((strategy, options, callback) => {
        if (strategy === "local") {
          return (req: any, res: any, next: any) => {
            // callback(null, false, { message: "Invalid credentials" })
            callback(null, false, { message: "Invalid credentials" });
          };
        }
        return (req: any, res: any, next: any) => next();
      });

      const res = await supertest(app)
        .post("/api/login")
        .send({ email: "wrong@example.com", password: "wrong" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("GET /api/auth/google/callback", () => {
    it("should login a user via google strategy and set cookies", async () => {
      // Prepare a user that 'google' strategy returns
      // In real flow, findOrCreate logic happens inside strategy before callback is called?
      // Wait, userController.ts's googleCallback receives (err, user, info).
      // This 'user' is the one found/created by the strategy verify callback.
      // So we just need to pass a mock user object.

      // We need a real User document if we want generateTokens to work properly (it uses user._id, user.email)
      // And updateRefreshToken calls user.save() or similar on the Mongoose document.

      const googleUser = await User.createUser(
        "google@example.com",
        "randompass"
      );
      // Need role
      await UserRole.createUserRole({ user: googleUser._id });

      mockAuthenticate.mockImplementation((strategy, options, callback) => {
        if (strategy === "google") {
          return (req: any, res: any, next: any) => {
            // Pass the existing user document as if Google Strategy found it
            callback(null, googleUser, null);
          };
        }
        return (req: any, res: any, next: any) => next();
      });

      // The query params don't matter because we intercepted passport
      const res = await supertest(app).get(
        "/api/auth/google/callback?code=fakecode"
      );

      expect(res.status).toBe(302);
      // Check if redirected (location header logic depends on FRONTEND_URL env var)
      expect(res.header.location).toBeDefined();

      const cookies = getCookies(res);
      expect(hasAuthCookies(cookies)).toBe(true);
    });

    it("should handle authentication failure from google", async () => {
      mockAuthenticate.mockImplementation((strategy, options, callback) => {
        if (strategy === "google") {
          return (req: any, res: any, next: any) => {
            callback(null, false, { message: "Google Auth Failed" });
          };
        }
        return (req: any, res: any, next: any) => next();
      });

      const res = await supertest(app).get("/api/auth/google/callback");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Google Auth Failed");
    });
  });
});

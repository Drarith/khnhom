import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import type { Request, Response, NextFunction } from "express";

// Mock dependencies BEFORE importing the module under test
vi.mock("../../src/model/profileModel.js", () => {
  return {
    default: {
      findOne: vi.fn(),
    },
  };
});

vi.mock("../../src/utils/tokenUtils.js", () => {
  return {
    verifyAccessToken: vi.fn(),
  };
});

// Import module under test
import { authenticateToken } from "../../src/middleware/auth.js";
import Profile from "../../src/model/profileModel.js";
import * as tokenUtils from "../../src/utils/tokenUtils.js";

// Helper to create mock objects
function makeReq(cookies = {}) {
  return {
    cookies,
    headers: {},
  } as unknown as Request;
}

function makeRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

function makeNext() {
  return vi.fn() as NextFunction;
}

describe("authenticateToken middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 401 when no token is provided in cookies", async () => {
    const req = makeReq({}); // No access_token
    const res = makeRes();
    const next = makeNext();

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No token provided",
      code: "TOKEN_EXPIRED",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when verifyAccessToken throws TokenExpiredError", async () => {
    const token = "expired.token";
    const req = makeReq({ access_token: token });
    const res = makeRes();
    const next = makeNext();

    const error = new Error("jwt expired");
    error.name = "TokenExpiredError";
    (tokenUtils.verifyAccessToken as Mock).mockImplementation(() => {
      throw error;
    });

    await authenticateToken(req, res, next);

    expect(tokenUtils.verifyAccessToken).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token expired",
      code: "TOKEN_EXPIRED",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when verifyAccessToken throws JsonWebTokenError (invalid token)", async () => {
    const token = "invalid.token";
    const req = makeReq({ access_token: token });
    const res = makeRes();
    const next = makeNext();

    const error = new Error("invalid signature");
    error.name = "JsonWebTokenError";
    (tokenUtils.verifyAccessToken as Mock).mockImplementation(() => {
      throw error;
    });

    await authenticateToken(req, res, next);

    expect(tokenUtils.verifyAccessToken).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid token",
      code: "TOKEN_INVALID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when verifyAccessToken throws generic Error", async () => {
    const token = "bad.token";
    const req = makeReq({ access_token: token });
    const res = makeRes();
    const next = makeNext();

    const error = new Error("Something went wrong");
    (tokenUtils.verifyAccessToken as Mock).mockImplementation(() => {
      throw error;
    });

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token verification failed",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("successfully authenticates, sets req.user, and calls next when token is valid", async () => {
    const token = "valid.token";
    const userPayload = { id: "user123", email: "test@example.com" };
    const req = makeReq({ access_token: token });
    const res = makeRes();
    const next = makeNext();

    (tokenUtils.verifyAccessToken as Mock).mockReturnValue(userPayload);
    // Mock Profile.findOne to resolve to null (no profile found case)
    (Profile.findOne as Mock).mockResolvedValue(null);

    await authenticateToken(req, res, next);

    expect(tokenUtils.verifyAccessToken).toHaveBeenCalledWith(token);
    expect(req.user).toEqual(userPayload);
    expect(Profile.findOne).toHaveBeenCalledWith({ user: userPayload.id });
    expect(req.profile).toBeUndefined(); // Assuming it wasn't set before
    expect(next).toHaveBeenCalled();
  });

  it("authenticates and attaches req.profile when profile exists", async () => {
    const token = "valid.token";
    const userPayload = { id: "user123", email: "test@example.com" };
    const mockProfile = {
      _id: "profile123",
      user: "user123",
      username: "tester",
    };

    const req = makeReq({ access_token: token });
    const res = makeRes();
    const next = makeNext();

    (tokenUtils.verifyAccessToken as Mock).mockReturnValue(userPayload);
    (Profile.findOne as Mock).mockResolvedValue(mockProfile);

    await authenticateToken(req, res, next);

    expect(req.user).toEqual(userPayload);
    expect(Profile.findOne).toHaveBeenCalledWith({ user: userPayload.id });
    expect(req.profile).toBe(mockProfile);
    expect(next).toHaveBeenCalled();
  });

  it("authenticates but logs error if Profile.findOne fails (does not block flow)", async () => {
    const token = "valid.token";
    const userPayload = { id: "user123", email: "test@example.com" };

    const req = makeReq({ access_token: token });
    const res = makeRes();
    const next = makeNext();

    (tokenUtils.verifyAccessToken as Mock).mockReturnValue(userPayload);

    const dbError = new Error("DB Connection Failed");
    (Profile.findOne as Mock).mockRejectedValue(dbError);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await authenticateToken(req, res, next);

    expect(req.user).toEqual(userPayload);
    // It should try to fetch
    expect(Profile.findOne).toHaveBeenCalledWith({ user: userPayload.id });
    // It should catch error and log it
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching profile in authenticateToken:",
      dbError
    );
    // It should still call next()
    expect(next).toHaveBeenCalled();
  });
});

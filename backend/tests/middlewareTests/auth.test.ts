import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";

// Import middleware and model under test
import { authenticateToken } from "../../src/middleware/auth.js";
import Profile from "../../src/model/profileModel.js";

// Minimal mock Request/Response shapes (match existing style)
function makeReq(headers = {}) {
  return { headers } as any;
}

function makeRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

function makeNext() {
  return vi.fn();
}

describe("authenticateToken middleware", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV };
    process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.restoreAllMocks();
  });

  it("returns 401 when no token provided", () => {
    const req = makeReq({});
    const res = makeRes();
    const next = makeNext();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when token is invalid", () => {
    const req = makeReq({ authorization: "Bearer bad.token.here" });
    const res = makeRes();
    const next = makeNext();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user when token is valid and no profile exists", async () => {
    const payload = { id: "123", email: "test@example.com" };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    const req = makeReq({ authorization: `Bearer ${token}` });
    const res = makeRes();

    // Ensure Profile.findOne resolves to null (no profile)
    const findOneSpy = vi
      .spyOn(Profile, "findOne")
      .mockResolvedValue(null as any);

    // Wait for middleware to call next()
    const nextMock = vi.fn();
    await new Promise<void>((resolve) => {
      const wrappedNext = (...args: any[]) => {
        nextMock(...args);
        resolve();
      };
      authenticateToken(req, res, wrappedNext as any);
    });

    expect(findOneSpy).toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.email).toBe(payload.email);
    // No profile in DB, so req.profile should be undefined
    expect(req.profile).toBeUndefined();
  });

  it("calls next and sets req.user and req.profile when token is valid and profile exists", async () => {
    const payload = { id: "321", email: "profile@example.com" };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    const req = makeReq({ authorization: `Bearer ${token}` });
    const res = makeRes();

    // Fake profile document returned by Profile.findOne
    const fakeProfile = {
      _id: "fakeProfileId",
      user: payload.id,
      username: "testuser",
      links: [],
    } as any;

    const findOneSpy = vi
      .spyOn(Profile, "findOne")
      .mockResolvedValue(fakeProfile);

    // Wait for middleware to call next()
    const nextMock = vi.fn();
    await new Promise<void>((resolve) => {
      const wrappedNext = (...args: any[]) => {
        nextMock(...args);
        resolve();
      };
      authenticateToken(req, res, wrappedNext as any);
    });

    expect(findOneSpy).toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.email).toBe(payload.email);
    // Profile should be attached
    expect(req.profile).toBeDefined();
    expect(req.profile.username).toBe("testuser");
  });

  it("logs error and still calls next when Profile.findOne throws", async () => {
    const payload = { id: "999", email: "err@example.com" };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    const req = makeReq({ authorization: `Bearer ${token}` });
    const res = makeRes();

    // Make Profile.findOne reject
    const findOneSpy = vi
      .spyOn(Profile, "findOne")
      .mockRejectedValue(new Error("DB is down"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Wait for middleware to call next()
    const nextMock = vi.fn();
    await new Promise<void>((resolve) => {
      const wrappedNext = (...args: any[]) => {
        nextMock(...args);
        resolve();
      };
      authenticateToken(req, res, wrappedNext as any);
    });

    expect(findOneSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
    // Because profile fetch failed, middleware should still attach req.user but not req.profile
    expect(req.user).toBeDefined();
    expect(req.profile).toBeUndefined();

    consoleSpy.mockRestore();
  });
});

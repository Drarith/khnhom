import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../../src/middleware/auth.js";

// Minimal mock Request/Response shapes
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

  it("calls next and sets req.user when token is valid", () => {
    const payload = { id: "123", email: "test@example.com" };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);
    const req = makeReq({ authorization: `Bearer ${token}` });
    const res = makeRes();
    const next = makeNext();

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.email).toBe(payload.email);
  });
});

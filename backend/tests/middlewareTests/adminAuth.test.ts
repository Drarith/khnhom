import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requireAdmin } from "../../src/middleware/adminAuth.js";
import UserRole from "../../src/model/roleModel.js";
import { Role } from "../../src/types/role.js";

vi.mock("../../src/model/roleModel.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe("requireAdmin middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { id: "user123", email: "test@example.com" },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should allow admin users to proceed", async () => {
    (UserRole.findOne as any).mockResolvedValue({
      user: "user123",
      role: Role.Admin,
    });

    await requireAdmin(req as Request, res as Response, next);

    expect(UserRole.findOne).toHaveBeenCalledWith({ user: "user123" });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should reject non-admin users", async () => {
    (UserRole.findOne as any).mockResolvedValue({
      user: "user123",
      role: Role.User,
    });

    await requireAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Forbidden: Admin access required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject when user has no role", async () => {
    (UserRole.findOne as any).mockResolvedValue(null);

    await requireAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Forbidden: Admin access required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject unauthenticated requests", async () => {
    req.user = undefined;

    await requireAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
    expect(UserRole.findOne).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    (UserRole.findOne as any).mockRejectedValue(new Error("DB Error"));

    await requireAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject supporter role", async () => {
    (UserRole.findOne as any).mockResolvedValue({
      user: "user123",
      role: Role.Supporter,
    });

    await requireAdmin(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("should check role for correct user ID", async () => {
    req.user = { id: "specific-user-id", email: "test@example.com" };
    (UserRole.findOne as any).mockResolvedValue({
      user: "specific-user-id",
      role: Role.Admin,
    });

    await requireAdmin(req as Request, res as Response, next);

    expect(UserRole.findOne).toHaveBeenCalledWith({ user: "specific-user-id" });
    expect(next).toHaveBeenCalled();
  });
});

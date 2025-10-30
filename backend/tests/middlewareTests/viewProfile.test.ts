import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { trackProfileView } from "../../src/middleware/viewProfile.js";
import Profile from "../../src/model/profileModel.js";

// Mock the Profile model
vi.mock("../../src/model/profileModel.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe("trackProfileView middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
      cookies: {},
    };
    res = {
      cookie: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should call next() if username is not provided", async () => {
    await trackProfileView(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(Profile.findOne).not.toHaveBeenCalled();
  });

  it("should call next() if profile is not found", async () => {
    req.params = { username: "nonexistent" };
    (Profile.findOne as Mock).mockResolvedValue(null);

    await trackProfileView(req as Request, res as Response, next);

    expect(Profile.findOne).toHaveBeenCalledWith({ username: "nonexistent" });
    expect(next).toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  describe("when profile is found", () => {
    const mockProfile = {
      _id: "profile123",
      username: "testuser",
      views: 0,
      incrementViews: vi.fn().mockResolvedValue(undefined),
    };

    beforeEach(() => {
      req.params = { username: "testuser" };
      (Profile.findOne as Mock).mockResolvedValue(mockProfile);
      // Reset mocks for each test in this block
      vi.clearAllMocks();
      (Profile.findOne as Mock).mockResolvedValue(mockProfile);
    });

    it("should increment views and set cookie for a new view", async () => {
      await trackProfileView(req as Request, res as Response, next);

      expect(Profile.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(mockProfile.incrementViews).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith(
        "viewedProfile",
        JSON.stringify(["testuser"]),
        expect.any(Object)
      );
      expect((req as any).profile).toEqual(mockProfile);
      expect(next).toHaveBeenCalled();
    });

    it("should NOT increment views if cookie already contains username", async () => {
      req.cookies = { viewedProfile: JSON.stringify(["testuser"]) };

      await trackProfileView(req as Request, res as Response, next);

      expect(mockProfile.incrementViews).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect((req as any).profile).toEqual(mockProfile);
      expect(next).toHaveBeenCalled();
    });

    it("should add to existing cookie array", async () => {
      req.cookies = { viewedProfile: JSON.stringify(["anotheruser"]) };

      await trackProfileView(req as Request, res as Response, next);

      expect(mockProfile.incrementViews).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith(
        "viewedProfile",
        JSON.stringify(["anotheruser", "testuser"]),
        expect.any(Object)
      );
      expect(next).toHaveBeenCalled();
    });

    it("should handle malformed cookie gracefully", async () => {
      req.cookies = { viewedProfile: "not-a-json-string" };

      await trackProfileView(req as Request, res as Response, next);

      expect(mockProfile.incrementViews).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith(
        "viewedProfile",
        JSON.stringify(["testuser"]),
        expect.any(Object)
      );
      expect(next).toHaveBeenCalled();
    });
  });
});

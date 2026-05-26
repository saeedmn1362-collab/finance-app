import * as authService from "../auth.service";
import prisma from "../../../lib/prisma";
import { AppError } from "../../../core/errors/AppError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../../lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  session: {
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const mockPrisma = prisma as any;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

const mockUser = {
  id: "user-1",
  name: "John",
  email: "john@test.com",
  password: "hashed-password",
};

const mockSession = { id: "session-1" };

const mockRefreshToken = {
  id: "rt-1",
  token: "refresh-token-value",
  sessionId: "session-1",
  userId: "user-1",
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  usedAt: null,
  session: mockSession,
};

describe("Auth Service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("register", () => {
    it("should register user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        name: "John",
        email: "john@test.com",
      });

      const result = await authService.register({
        name: "John",
        email: "john@test.com",
        password: "password123",
      });

      expect(result.id).toBe("user-1");
      expect(result.email).toBe("john@test.com");
      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });

    it("should reject duplicate email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        authService.register({
          name: "John",
          email: "john@test.com",
          password: "password123",
        })
      ).rejects.toThrow(AppError);
    });

    it("should not return password in response", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        name: "John",
        email: "john@test.com",
      });

      const result = await authService.register({
        name: "John",
        email: "john@test.com",
        password: "password123",
      });

      expect((result as any).password).toBeUndefined();
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue("mock-access-token");
      mockPrisma.session.create.mockResolvedValue(mockSession);
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await authService.login({
        email: "john@test.com",
        password: "password123",
      });

      expect(result.accessToken).toBe("mock-access-token");
      expect(result.user.id).toBe("user-1");
      expect(result.refreshToken).toBeDefined();
      expect(typeof result.refreshToken).toBe("string");
    });

    it("should reject wrong email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: "wrong@test.com", password: "password123" })
      ).rejects.toThrow(AppError);
    });

    it("should reject wrong password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: "john@test.com", password: "wrong" })
      ).rejects.toThrow(AppError);
    });

    it("should not expose which field is wrong", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const error = await authService
        .login({ email: "wrong@test.com", password: "x" })
        .catch((e) => e);

      expect(error.code).toBe("INVALID_CREDENTIALS");
    });

    it("should create session on login", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue("token");
      mockPrisma.session.create.mockResolvedValue(mockSession);
      mockPrisma.refreshToken.create.mockResolvedValue({});

      await authService.login(
        { email: "john@test.com", password: "password123" },
        { ipAddress: "127.0.0.1", deviceInfo: "Chrome" }
      );

      expect(mockPrisma.session.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-1",
            ipAddress: "127.0.0.1",
            deviceInfo: "Chrome",
          }),
        })
      );
    });
  });

  describe("refresh", () => {
    it("should rotate refresh token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);
      mockPrisma.refreshToken.update.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});
      (mockJwt.sign as jest.Mock).mockReturnValue("new-access-token");

      const result = await authService.refresh("refresh-token-value");

      expect(result.accessToken).toBe("new-access-token");
      expect(result.refreshToken).toBeDefined();
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "rt-1" },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        })
      );
    });

    it("should reject invalid refresh token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(
        authService.refresh("invalid-token")
      ).rejects.toThrow(AppError);
    });

    it("should reject revoked refresh token and revoke session", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        revokedAt: new Date(),
      });
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      await expect(
        authService.refresh("refresh-token-value")
      ).rejects.toThrow(AppError);

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
    });

    it("should reject expired refresh token", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        authService.refresh("refresh-token-value")
      ).rejects.toThrow(AppError);
    });
  });

  describe("logout", () => {
    it("should revoke session and tokens", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});
      mockPrisma.session.delete.mockResolvedValue({});

      const result = await authService.logout("refresh-token-value");

      expect(result.loggedOut).toBe(true);
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
      expect(mockPrisma.session.delete).toHaveBeenCalled();
    });

    it("should handle logout with invalid token gracefully", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      const result = await authService.logout("non-existent");

      expect(result.loggedOut).toBe(true);
    });
  });

  describe("logoutAll", () => {
    it("should revoke all sessions", async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});
      mockPrisma.session.deleteMany.mockResolvedValue({});

      const result = await authService.logoutAll("user-1");

      expect(result.loggedOut).toBe(true);
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-1", revokedAt: null },
        })
      );
      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
    });
  });

  describe("me", () => {
    it("should return user profile", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "John",
        email: "john@test.com",
      });

      const result = await authService.me("user-1");

      expect(result.id).toBe("user-1");
    });

    it("should reject if user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.me("non-existent")).rejects.toThrow(AppError);
    });
  });
});
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
      (mockJwt.sign as jest.Mock).mockReturnValue("mock-token");

      const result = await authService.login({
        email: "john@test.com",
        password: "password123",
      });

      expect(result.token).toBe("mock-token");
      expect(result.user.id).toBe("user-1");
    });

    it("should reject wrong email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: "wrong@test.com",
          password: "password123",
        })
      ).rejects.toThrow(AppError);
    });

    it("should reject wrong password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: "john@test.com",
          password: "wrong",
        })
      ).rejects.toThrow(AppError);
    });

    it("should not expose which field is wrong", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const error = await authService
        .login({ email: "wrong@test.com", password: "x" })
        .catch((e) => e);

      expect(error.code).toBe("INVALID_CREDENTIALS");
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
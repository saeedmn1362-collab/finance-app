import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AppError } from "../../core/errors/AppError";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

const getRefreshTokenExpiry = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return date;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (exists) {
    throw new AppError("Email already exists", 400, "EMAIL_EXISTS");
  }

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return user;
};

export const login = async (
  data: { email: string; password: string },
  meta: { ipAddress?: string; deviceInfo?: string } = {}
) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      ipAddress: meta.ipAddress ?? null,
      deviceInfo: meta.deviceInfo ?? null,
    },
  });

  const refreshTokenValue = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: refreshTokenValue,
      sessionId: session.id,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const accessToken = generateAccessToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken: refreshTokenValue,
  };
};

export const refresh = async (refreshTokenValue: string) => {
  const existing = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
    include: { session: true },
  });

  if (!existing) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  if (existing.revokedAt) {
    // token reuse detected — revoke entire session
    await prisma.refreshToken.updateMany({
      where: { sessionId: existing.sessionId },
      data: { revokedAt: new Date() },
    });
    throw new AppError("Refresh token reused", 401, "REFRESH_TOKEN_REUSED");
  }

  if (existing.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401, "REFRESH_TOKEN_EXPIRED");
  }

  // rotate: revoke old token
  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date(), usedAt: new Date() },
  });

  // issue new refresh token
  const newRefreshTokenValue = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: newRefreshTokenValue,
      sessionId: existing.sessionId,
      userId: existing.userId,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const accessToken = generateAccessToken(existing.userId);

  return {
    accessToken,
    refreshToken: newRefreshTokenValue,
  };
};

export const logout = async (refreshTokenValue: string) => {
  const existing = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
  });

  if (!existing || existing.revokedAt) {
    return { loggedOut: true };
  }

  await prisma.refreshToken.updateMany({
    where: { sessionId: existing.sessionId },
    data: { revokedAt: new Date() },
  });

  await prisma.session.delete({
    where: { id: existing.sessionId },
  });

  return { loggedOut: true };
};

export const logoutAll = async (userId: string) => {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  await prisma.session.deleteMany({
    where: { userId },
  });

  return { loggedOut: true };
};

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user;
};
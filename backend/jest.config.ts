import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  testMatch: ["**/__tests__/**/*.test.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  forceExit: true,

  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  };

export default config;
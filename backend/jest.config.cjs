module.exports = {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  testMatch: ["**/__tests__/**/*.test.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  clearMocks: true,

  restoreMocks: true,

  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],

  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },

  collectCoverage: true,
  coverageDirectory: "coverage",

  coverageReporters: ["text", "lcov", "html"],

  verbose: false,

  detectOpenHandles: false, // ❗ مهم: دیگه لازم نیست با forceExit بجنگی

  forceExit: false, // ❗ حذف کامل اجبار خروج

  testTimeout: 15000,
};
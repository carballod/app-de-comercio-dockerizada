module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/src/__tests__/**/*.test.ts", "**/src/**/*.spec.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/src/__tests__/config/setup.ts",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app.ts",
    "!src/seeds/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/config/setup.ts"],
};

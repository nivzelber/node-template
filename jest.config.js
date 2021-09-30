module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["js", "ts", "json"],
  setupFiles: ["<rootDir>/src/setup-tests.ts"],
  transform: {
    "^.+\\.ts*$": "ts-jest"
  }
};

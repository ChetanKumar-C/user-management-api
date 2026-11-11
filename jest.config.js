module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    setupFiles: ["<rootDir>/tests/setup.js"],
    clearMocks: true,
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/config/prisma.js"
    ],
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        }
    }
};
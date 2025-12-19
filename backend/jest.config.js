module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!**/logs/**',
        '!jest.config.js',
        '!server.js'
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true
};


/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // The root dir of your project
  roots: ['<rootDir>/src'],
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**'
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // A map from regular expressions to paths to transformers
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  // The test environment that will be used for testing
  testEnvironment: 'node',
  // To run MongoDB in memory
  preset: '@shelf/jest-mongodb'
}

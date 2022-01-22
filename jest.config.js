/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  // The root dir of your project
  roots: ['<rootDir>/src'],
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  // A map from regular expressions to paths to transformers
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-node'
}

module.exports = config

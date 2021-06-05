module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: '@shelf/jest-mongodb'
}

module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/data/protocols/**',
    '!<rootDir>/src/presentation/protocols/**',
    '!<rootDir>/src/domain/**',
    '!<rootDir>/src/**/*protocols.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: '@shelf/jest-mongodb'
}

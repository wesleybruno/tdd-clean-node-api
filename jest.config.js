export default {
  roots: ['<rootDir>/src'],
  testEnviroment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
}

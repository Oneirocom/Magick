/* eslint-disable */
export default {
  displayName: 'engine',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  silent: true, // lots of console.log calls
  globals: {},
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        // avoid failure for type-checking
        diagnostics: {
          exclude: ['**'],
        },
      },
    ],
    '^.+\\.jsx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  coverageDirectory: '../../coverage/packages/engine',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts*'],
  coveragePathIgnorePatterns: ['/node_modules/', './import-meta-env'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    './import-meta-env': '<rootDir>/test/jest-import-meta-env.ts',
  },
}

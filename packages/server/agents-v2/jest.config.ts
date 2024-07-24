import type { Config } from 'jest'

const config: Config = {
  displayName: 'agents-v2',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        useESM: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/packages/server/agents-v2',
  testMatch: ['**/src/**/*.spec.ts', '**/__tests__/integration/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/unit/'],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {},
}

export default config

/* eslint-disable */
export default {
  displayName: 'engine',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    }
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/engine',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
   moduleNameMapper: {
        './import-meta-env': '<rootDir>/test/jest-import-meta-env.ts',
    },
}

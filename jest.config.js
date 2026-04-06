module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
  moduleNameMapper: {
    '^react-native-vector-icons/(.*)$': '<rootDir>/__mocks__/vector-icon.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-?react-native|@react-native|react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|react-clone-referenced-element|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
};

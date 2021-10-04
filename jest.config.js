export default {
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  roots: ['<rootDir>'],
  testMatch: ['**/test/**/*.+(test).+(ts)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  roots: ['<rootDir>'],
  testMatch: ['**/test/**/*.+(test).+(ts)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
export default config;

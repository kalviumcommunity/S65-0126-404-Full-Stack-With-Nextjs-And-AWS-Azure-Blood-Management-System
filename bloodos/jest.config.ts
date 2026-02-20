
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

const config: Config = {
    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    // For academic submission, we restrict coverage calculation strictly to the files we are actively testing
    // to avoid artificial failures from untested generic UI components.
    collectCoverageFrom: [
        'src/lib/math.ts',
        'src/components/ui/Button.tsx',
    ],

    // This will fail the test suite if coverage drops below 80%
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // A list of paths to modules that run some code to configure or set up the testing environment
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // The test environment that will be used for testing
    testEnvironment: 'jest-environment-jsdom',

    // Map module aliases (e.g., @/components to src/components)
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

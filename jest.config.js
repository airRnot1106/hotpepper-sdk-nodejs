module.exports = {
    roots: ['<rootDir>/tests'],
    testPathIgnorePatterns: ['<rootDir>/.history', '<rootDir>/tests/local'],
    testMatch: [
        '**/tests/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};

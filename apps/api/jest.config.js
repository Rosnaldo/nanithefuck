
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.base.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s'],
    testTimeout: 60000,
    maxWorkers: 5,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/src/',
    }),
};

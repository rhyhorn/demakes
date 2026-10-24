import js from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

import { listGames } from './scripts/games.mjs';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),
  js.configs.recommended,
  plugins.stylistic,
  plugins.importX,
  plugins.typescriptEslint,
  plugins.react,
  plugins.reactHooks,
  plugins.reactA11y,
  ...configs.base.all,
  ...configs.react.all,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Build tooling runs in Node.
    files: ['*.mjs', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Node ESM requires explicit extensions in relative imports.
      'import-x/extensions': ['error', 'ignorePackages'],
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-console': 'off',
    },
  },
  {
    // Feature-Sliced Design: slices expose named exports through their index.ts public API.
    files: ['games/**/*.{ts,tsx}'],
    rules: {
      'import-x/prefer-default-export': 'off',
      // New JSX transform ("jsx": "react-jsx"): no need to import React.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
  {
    // The hub and every game are independent apps: no imports across their folders.
    rules: {
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            { target: './src', from: './games' },
            { target: './games', from: './src' },
            ...listGames().map((id) => ({
              target: `./games/${id}`,
              from: './games',
              except: [`./${id}`],
            })),
          ],
        },
      ],
    },
  },
  // Must stay last: turns off formatting rules that conflict with Prettier.
  prettierConfig,
]);

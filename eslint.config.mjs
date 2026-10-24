import js from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),
  js.configs.recommended,
  plugins.stylistic,
  plugins.importX,
  plugins.typescriptEslint,
  ...configs.base.all,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Must stay last: turns off formatting rules that conflict with Prettier.
  prettierConfig,
]);

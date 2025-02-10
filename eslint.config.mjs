import js from '@eslint/js';
import globals, { commonjs } from 'globals';
import ts from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    env: {
      commonjs: true,
    },
  },
  { ignores: ['dist/'] },
];

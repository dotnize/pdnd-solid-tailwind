// @ts-check

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import solid from 'eslint-plugin-solid/configs/typescript';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  },
];

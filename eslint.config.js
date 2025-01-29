import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import solid from 'eslint-plugin-solid/configs/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  eslintConfigPrettier,
);

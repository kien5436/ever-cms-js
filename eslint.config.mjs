// @ts-nocheck
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pk from 'eslint-config-pk';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...pk,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'new-cap': 'off',
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
);

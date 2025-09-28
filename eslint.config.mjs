import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends('next', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'next/core-web-vitals', 'next/typescript', 'standard'),
    settings: { react: { version: 'detect' } },
    rules: {
      'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'space-before-function-paren': 'off',
      semi: 'off',
      indent: 'off',
      'comma-dangle': 'off',
      'no-undef': 'off',
      quotes: 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'space-before-blocks': 'off',
      'multiline-ternary': 'off',
      'func-call-spacing': 'off',
      'no-useless-escape': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-lone-blocks': 'off',
      'eol-last': 'off',
      'object-curly-spacing': 'off',
    },
  },
]);

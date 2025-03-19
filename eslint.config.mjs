import stylistic from '@stylistic/eslint-plugin'
import eslint from '@eslint/js'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['out/**/*', 'eslint.config.mjs', '.next/**/*'],
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js'],
          defaultProject: './tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  eslintPluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
    rules: eslintPluginReactHooks.configs.recommended.rules,
  },
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['error', 'warn'],
        },
      ],
      'no-underscore-dangle': 0,
      curly: 'error',
      semi: ['error', 'never'],

      '@stylistic/object-curly-newline': 'error',
      '@stylistic/curly-newline': 'error',
      '@stylistic/object-curly-newline': 'error',

      '@typescript-eslint/restrict-template-expressions': 'off',

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
    },
  },
)

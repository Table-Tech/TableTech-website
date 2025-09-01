import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'api/**/*', 'build', 'out', '**/*.d.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Allow unused variables and parameters for now - they might be used later or kept for reference
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-parameters': 'off',
      // Allow explicit any in specific cases where complex typing is not worth the effort
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unsafe function types for third-party integrations
      '@typescript-eslint/no-unsafe-function-type': 'warn',
    },
  },
)

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'turbo',
    'prettier',
  ],
  plugins: ['simple-import-sort'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js', '.eslintrc.cjs'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
  },
}

module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['simple-import-sort'],
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*'],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
  },
}

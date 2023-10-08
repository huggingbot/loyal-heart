module.exports = {
  root: true,
  extends: ['@loyal-heart/eslint-config-custom', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  plugins: ['react-refresh', '@tanstack/query'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}

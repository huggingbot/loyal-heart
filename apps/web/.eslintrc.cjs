module.exports = {
  root: true,
  extends: ['@loyal-heart/eslint-config-custom'],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  }
};

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'react-app',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    //use this to add or override rules
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
};

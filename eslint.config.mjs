export default [
  {
    ignores: ['.nuxt/**', '.output/**', 'node_modules/**'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];

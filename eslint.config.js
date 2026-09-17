export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'contracts/**',
      'coverage/**',
      'public/**',
    ],
  },
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'off',
    },
  },
];

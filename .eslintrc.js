module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  rules: {
    'no-irregular-whitespace': ['error', { skipRegExps: true, skipComments: true, skipStrings: true }],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-implicit-any-catch': 'off',
    'vue/multi-word-component-names': 0
  },
  overrides: [
    {
      files: ['cdk/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './cdk/tsconfig.json'
      }
    }
  ]
}

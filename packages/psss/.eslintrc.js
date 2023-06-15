/* eslint-env node */
module.exports = {
  extends: '../../.eslintrc-js-frontend.json',
  // ignore cypress, not used
  ignorePatterns: [
    'build/',
    'cypress/',
    'node_modules/',
    'public/',
    '.eslintrc.js',
  ]
};

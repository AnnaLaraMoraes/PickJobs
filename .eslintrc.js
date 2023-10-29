module.exports = {
  extends: ["eslint:recommended"],
  plugins: ["@angular-eslint"],
  rules: {
    "@angular-eslint/directive-selector": ["error"],
    "@angular-eslint/component-selector": ["error"],
    "@angular-eslint/no-pipe-impure": ["error"],
  },
};

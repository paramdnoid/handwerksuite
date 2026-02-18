/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@zunftgewerk/eslint-config/base"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

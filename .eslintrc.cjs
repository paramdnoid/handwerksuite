/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@zunftgewerk/eslint-config/base"],
  ignorePatterns: ["apps/", "packages/"],
};

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies lead to hard-to-debug issues",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment: "Modules that are not imported by any other module",
      from: { orphan: true, pathNot: ["(^|/)index\\.ts$", "\\.d\\.ts$", "\\.test\\.ts$"] },
      to: {},
    },
    {
      name: "no-app-to-app",
      severity: "error",
      comment: "Apps must not import from other apps directly",
      from: { path: "^apps/([^/]+)/" },
      to: { path: "^apps/(?!\\1)[^/]+/" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};

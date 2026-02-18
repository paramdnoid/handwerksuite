export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'auth',
        'crypto',
        'db',
        'ui',
        'sync',
        'stripe',
        'types',
        'env',
        'app-core',
        'landing',
        'web',
        'desktop',
        'mobile',
        'config',
        'docker',
        'ci',
        'deps',
      ],
    ],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
  },
};

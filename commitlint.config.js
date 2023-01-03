module.exports = {
  extends: ['@commitlint/config-conventional'],
  maxSubjectLength: 100, // 'header-max-length': [2, 'always', 100]
  rules: {
    'type-enum': [2, 'always', [
      'build',
      'chore',
      'ci',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      'test',
      'update',
      'add'
    ]], // error if scope is given but not in provided list
  },
}


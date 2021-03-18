module.exports = {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-lerna-scopes',
  ],
  rules: {
    'signed-off-by': [2, 'always', 'Signed-off-by'],
  },
}

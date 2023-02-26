module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git'
  ],
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/git',
    '@semantic-release/npm',
    '@semantic-release/github'
  ],
  prepare: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }
  ],
  publish: [
    '@semantic-release/npm',
    '@semantic-release/github'
  ]
};

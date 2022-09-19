module.exports = {
  onPreBuild: ({ netlifyConfig, utils: { git } }) => {
    const coreChanges = git.fileMatch('core/**/*')
    const coreChanged = coreChanges.edited.length !== 0
    const installCanary = 'cd client && yarn add @thothai/core@canary && cd ..'
    netlifyConfig.build.command = coreChanged
      ? `${installCanary} && ${netlifyConfig.build.command}`
      : netlifyConfig.build.command
  },
}

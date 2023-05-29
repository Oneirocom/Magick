function install(editor, params) {
  editor.on('renderconnection', data => {
    console.log('RENDER CONNECTION', data)
  })
}

const plugin = {
  name: 'HighlightPlugin',
  install,
}

export default plugin

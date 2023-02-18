export class Background {
  constructor(editor, element) {
    if (!element) return
    const el =
      element instanceof HTMLElement ? element : document.createElement('div')

    el.classList += ` rete-background ${element === true ? 'default' : ''}`
    editor.view.area.appendChild(el)
  }
}

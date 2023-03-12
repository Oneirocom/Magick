const scaleFactor = .02

export class Background {
  constructor(editor, element) {
    if (!element) return console.log('no element found for background')

    editor.on('translate', (event) => {
      const { k, x, y } = event.transform
      element.style.backgroundPosition = `${x}px ${y}px`
      element.style.backgroundSize = `${(k * 100 * scaleFactor)}%`
    })

    editor.on('zoom', (event) => {
      const { k, x, y } = event.transform
      element.style.backgroundSize = `${k * 100 * scaleFactor}%`
      element.style.backgroundPosition = `${x}px ${y}px`
    })
  }
}

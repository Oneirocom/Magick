import { refreshNodeEditor, getLocalStorage } from './utils'
const scaleFactor = 0.04

export class Background {
  constructor(editor, element, tab) {
    this._editor = editor
    if (!element) return console.log('no element found for background')

    // Restore the zoom the last zoom level of each graph if exist
    const zoomValues = getLocalStorage(`zoomValues-${tab.id}`)

    if (zoomValues) {
      element.style.backgroundPosition = `${zoomValues?.zoomLevelValues?.x}px ${zoomValues?.zoomLevelValues?.y}px`
      element.style.backgroundSize = `${
        Math.max(zoomValues?.zoomLevelValues?.k, 0.25) * 100 * scaleFactor
      }%`

      editor.view.area.transform.x = zoomValues?.translateValues?.x
      editor.view.area.transform.y = zoomValues?.translateValues?.y
      editor.view.area.transform.k = zoomValues?.translateValues?.k

      // Refresh NodeEditor to show up restored transformation
      refreshNodeEditor(tab.id)
    }

    editor.on('translate', event => {
      const { k, x, y } = event.transform
      element.style.backgroundPosition = `${x}px ${y}px`
      element.style.backgroundSize = `${Math.max(k, 0.25) * 100 * scaleFactor}%`

      const previousZoomValues = getLocalStorage(`zoomValues-${tab.id}`)

      window.localStorage.setItem(
        `zoomValues-${tab.id}`,
        JSON.stringify({ ...previousZoomValues, translateValues: { x, y, k } })
      )
    })

    editor.on('zoom', event => {
      if (event.transform) {
        const { k, x, y } = event.transform
        element.style.backgroundSize = `${
          Math.max(k, 0.25) * 100 * scaleFactor
        }%`
        element.style.backgroundPosition = `${x}px ${y}px`

        const previousZoomValues = getLocalStorage(`zoomValues-${tab.id}`)

        window.localStorage.setItem(
          `zoomValues-${tab.id}`,
          JSON.stringify({
            ...previousZoomValues,
            zoomLevelValues: { x, y, k },
            translateValues: { x, y, k },
          })
        )
      }
    })
  }
}

import { refreshNodeEditor } from "./utils"
const scaleFactor = .04

export class Background {
  constructor(editor, element, tab) {
    this._editor = editor
    if (!element) return console.log('no element found for background')

    // Restore the zoom the last zoom level of each graph if exist
    const zoomValues = localStorage.getItem( `zoomValues-${tab.id}`)
    let parsedZoomValues;

    if (zoomValues) {
      parsedZoomValues = JSON.parse(zoomValues)
      element.style.backgroundPosition = `${parsedZoomValues?.zoomLevelValues?.x}px ${parsedZoomValues?.zoomLevelValues?.y}px`
      element.style.backgroundSize = `${Math.max(parsedZoomValues?.zoomLevelValues?.k, .25) * 100 * scaleFactor}%`
      
      editor.view.area.transform.x = parsedZoomValues?.translateValues?.x
      editor.view.area.transform.y = parsedZoomValues?.translateValues?.y
      editor.view.area.transform.k = parsedZoomValues?.translateValues?.k 
      
      // Refresh NodeEditor to show up restored transformation
      refreshNodeEditor(tab.id)
    }

    editor.on('translate', (event) => {
      const { k, x, y } = event.transform
      element.style.backgroundPosition = `${x}px ${y}px`
      element.style.backgroundSize = `${Math.max(k, .25) * 100 * scaleFactor}%`

      window.localStorage.setItem(
       `zoomValues-${tab.id}`,
        JSON.stringify({ ...parsedZoomValues, translateValues: { x, y, k} })
      )
    })

    editor.on('zoom', (event) => {
      if(event.transform){
        const { k, x, y } = event.transform
        element.style.backgroundSize = `${Math.max(k, .25) * 100 * scaleFactor}%`
        element.style.backgroundPosition = `${x}px ${y}px`

        window.localStorage.setItem(
         `zoomValues-${tab.id}`,
          JSON.stringify({ ...parsedZoomValues, zoomLevelValues: { x, y, k} })
        )
      }
    })
  }
}

import { MagickComponent } from '../../engine'
import { IRunContextEditor, MagickNode } from '../../types'

function install(editor: IRunContextEditor) {
  // handle publishing and subscribing to inspector
  const nodeDataMap = {}

  const detectDoubleClick = (node, callback: () => void) => {
    if (!nodeDataMap[node.id]) {
      nodeDataMap[node.id] = {
        clickCount: 0,
      }
    }

    const timerData = nodeDataMap[node.id]
    timerData.clickCount++
    if (timerData.clickCount === 1) {
      timerData.clickTimer = setTimeout(function () {
        timerData.clickCount = 0
      }, 250)
    } else if (timerData.clickCount === 2) {
      clearTimeout(timerData.clickTimer)
      timerData.clickCount = 0
      callback()
    }
  }

  editor.on('nodeselect', (node: MagickNode) => {
    detectDoubleClick(node, () => {
      const component = editor.getComponent(
        node.name
      ) as unknown as MagickComponent<void>
      if (component?.onDoubleClick) component.onDoubleClick(node)
    })
  })
}

const defaultExport = {
  name: 'nodeClick',
  install,
}

export default defaultExport

// let clickCount = 0;
// let clickTimer = 0;

// document.addEventListener("click", function() {
//   clickCount++;
//   if (clickCount === 1) {
//     clickTimer = setTimeout(function() {
//       clickCount = 0;
//     }, 250);
//   } else if (clickCount === 2) {
//     clearTimeout(clickTimer);
//     clickCount = 0;
//     console.log("Double click detected!");
//   }
// });

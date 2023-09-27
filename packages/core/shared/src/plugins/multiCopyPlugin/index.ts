import { Input, Output, Connection } from 'shared/rete'
import { IRunContextEditor, MagickNode } from '../../types'

function install(editor: IRunContextEditor) {
  editor.bind('multiselectcopy')
  editor.bind('multiselectpaste')

  // Define variables and constants
  const storedNodesKey = 'selectedNodes'
  const connectedPairKey = 'connectedNodePairs'
  let mouse = { x: 0, y: 0 }

  // Store the current mouse position on click event
  editor.on('click', ({ e, container }) => {
    mouse = { x: editor.view.area.mouse.x, y: editor.view.area.mouse.y }
  })

  // Copy the selected nodes and their connections
  editor.on('multiselectcopy', () => {
    if (!editor.selected.list.length) return

    const copiedNodes: MagickNode[] = []
    editor.selected.each(node => {
      copiedNodes.push(node as MagickNode)
    })

    const connections: Connection[] = copiedNodes
      .map(item => item.getConnections())
      .reduce((acc, value) => acc.concat(value))

    // Store this array instead because JSON.stringify() cannot store deep object params
    const connectedNodePairs = connections.map(i => {
      return {
        input: {
          key: i.input.key,
          name: i.input.name,
          socketName: i.input.socket.name,
          node: i.input.node,
        },
        output: {
          key: i.output.key,
          name: i.output.name,
          socketName: i.output.socket.name,
          node: i.output.node,
        },
      }
    })

    localStorage.setItem(storedNodesKey, JSON.stringify(copiedNodes))
    localStorage.setItem(connectedPairKey, JSON.stringify(connectedNodePairs))
  })

  // Paste the copied nodes and connections
  editor.on('multiselectpaste', async () => {
    if (!mouse.x || !mouse.y) return

    const selectedNodes = await localStorage.getItem(storedNodesKey)
    if (!selectedNodes) return

    // TODO: add schema check
    const parsedNodes = JSON.parse(selectedNodes) as MagickNode[]
    if (!parsedNodes.length) return

    // get the last copied node's clientXY position
    const [nodeX, nodeY] = parsedNodes[parsedNodes?.length - 1].position

    // get diffX/diffY correlated with the nodeX/nodeY above
    // used to create positions of copy nodes later
    const posDiff: Array<{ diffX: number; diffY: number }> = []
    parsedNodes.forEach(node => {
      const [x, y] = node.position
      posDiff.push({ diffX: x - nodeX, diffY: y - nodeY })
    })

    // Call the main function after preprocessing
    pasteNodesAndConnections(editor, parsedNodes, mouse, posDiff)
  })
}

const createConnections = async (editor, nodeMapping) => {
  const pairs = await localStorage.getItem('connectedNodePairs')
  if (!pairs) return
  const parsedPairs = JSON.parse(pairs)

  // filter the repeated connections and get the unique ones
  const uniqueConns = parsedPairs.filter((value, index, self) => {
    return (
      index ===
      self.findIndex(t => {
        const condition =
          t.input.key === value.input.key &&
          t.output.key === value.output.key &&
          t.input.node.id === value.input.node.id &&
          t.output.node.id === value.output.node.id

        return condition
      })
    )
  })

  // loop through the old connections
  for await (const pair of uniqueConns) {
    const { input, output } = pair

    // get the copied versions of the selected nodes
    const inputNode = nodeMapping[input.node.id]
    const outputNode = nodeMapping[output.node.id]

    // Proceed if the two nodes were the selected ones only
    if (inputNode && outputNode) {
      // create a new Connection
      editor.connect(
        outputNode.outputs.get(output.key) as Output,
        inputNode.inputs.get(input.key) as Input
      )
    }
  }

  // clear the data
  localStorage.removeItem('selectedNodes')
  localStorage.removeItem('connectedNodePairs')
}

const pasteNodesAndConnections = async (editor, jsonNodes, mouse, posDiff) => {
  // Create a map of the cloned nodes to store the mapping between the original and cloned nodes.
  let cloneNodesMap = {}

  // Loop through each node in the list of copied nodes.
  let i = 0
  for await (const node of jsonNodes) {
    // Extract the necessary information for recreating the node.
    const { name, id, position, ...params } = node

    const { diffX, diffY } = posDiff[i]

    // Get the component from the editor components registry.
    const component = editor.components.get(name)

    // Create the cloned node and add it to the editor view.
    const cloneItem = await createNode(component, {
      ...params,
      x: mouse.x + diffX,
      y: mouse.y + diffY,
    })

    // addNode to the EditorView so it can trigger necessary things
    await editor.addNode(cloneItem)

    // Store the mapping between the original and cloned nodes.
    cloneNodesMap = { ...cloneNodesMap, [id]: cloneItem }

    i++
  }

  // Wait for the nodes to be fully created before proceeding
  // 1000 milis is a random number. Assume that user will copy a large amounts of nodes
  setTimeout(() => {
    // Create the connections for the cloned nodes.
    createConnections(editor, cloneNodesMap)
  }, 1000)
}

export async function createNode(
  component,
  { data = {}, meta = {}, x = 0, y = 0 }
) {
  const node = await component.createNode(data)

  node.position = [x, y]

  return node
}

const defaultExport = {
  name: 'multiCopyPlugin',
  install,
}

export default defaultExport

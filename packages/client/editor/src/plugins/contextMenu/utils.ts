// DOCUMENTED
/**
 * Returns a deep copy of an object using the JSON method.
 * @param obj The object to be copied.
 */
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Creates a new node and sets its metadata, data and position according to the input parameters.
 * @param component The component that will create the new node.
 * @param param1 An object containing the node's metadata, data and position.
 * @param param1.data The data object to be copied into the new node.
 * @param param1.meta The metadata object to be copied into the new node.
 * @param param1.x The x-coordinate of the node's position.
 * @param param1.y The y-coordinate of the node's position.
 * @returns A promise that resolves to the created node.
 */
export async function createNode(
  component: any,
  {
    data = {},
    meta = {},
    x = 0,
    y = 0,
  }: { data?: any; meta?: any; x?: number; y?: number }
): Promise<any> {
  const node = await component.createNode(deepCopy(data))

  node.meta = Object.assign(deepCopy(meta), node.meta)
  node.position = [x, y]

  return node
}

/**
 * Traverses a tree of objects and invokes a callback on each function.
 * @param items The object to be traversed.
 * @param callback The callback function.
 * @param path An optional path array to traverse deeper nested trees.
 */
export function traverse(
  items: any,
  callback: (key: string, value: any, path: string[]) => void,
  path: string[] = []
) {
  if (typeof items !== 'object') return

  Object.keys(items).forEach(key => {
    if (typeof items[key] === 'function') callback(key, items[key], path)
    else traverse(items[key], callback, [...path, key])
  })
}

/**
 * Returns new coordinates for an element's position based on the size of the viewport.
 * @param coord An array containing the [x,y] coordinates.
 * @param element The element to calculate the new position based on its size.
 * @returns An array containing the adjusted [x,y] coordinates.
 */
export function fitViewport(coord: number[], element: HTMLElement): number[] {
  return [
    Math.min(coord[0], window.innerWidth - element.clientWidth),
    Math.min(coord[1], window.innerHeight - element.clientHeight),
  ]
}

/**
 * Injects an item into a nested array of items.
 * @param items The array of items.
 * @param title The title of the new item.
 * @param onClick The onClick function of the new item.
 * @param path An array representing the nested path where the new item should be added.
 */
export function injectItem(
  items: any[],
  title: string,
  onClick: (args) => void,
  path: string[]
) {
  for (const level of path) {
    let exist = items.find(i => i.title === level)

    if (!exist) {
      exist = { title: level, subitems: [] }
      items.push(exist)
    }

    items = exist.subitems || (exist.subitems = [])
  }

  items.push({ title, onClick })
}

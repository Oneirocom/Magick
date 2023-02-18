import { NodeEditor } from 'rete'

export function getHook<T extends unknown>(
  editor: NodeEditor,
  name: undefined | string,
  method: keyof T
) {
  if (!name) return () => null

  const component = editor.getComponent(name)

  if (method in component) {
    const c = component as T
    const func = c[method] as unknown as Function

    return func.bind(component)
  }

  return () => null
}

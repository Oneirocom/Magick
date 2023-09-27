import { NodeEditor } from 'shared/rete'

import {
  OnCreated,
  OnDestroyed,
  OnConnect,
  OnConnected,
  OnDisconnect,
  OnDisconnected,
} from './interfaces'

type HookActions =
  | OnCreated
  | OnDestroyed
  | OnConnect
  | OnConnected
  | OnDisconnect
  | OnDisconnected

export function getHook<T extends HookActions>(
  editor: NodeEditor,
  name: undefined | string,
  method: keyof T
): (connection: unknown) => unknown {
  if (!name) return () => null

  const component = editor.getComponent(name)

  if (component[method as string]) {
    const c = component as unknown as T
    const func = c[method] as () => unknown

    return func.bind(component)
  }

  return () => null
}

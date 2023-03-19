import { NodeEditor } from 'rete'

import {
  OnCreated,
  OnDestroyed,
  OnConnect,
  OnConnected,
  OnDisconnect,
  OnDisconnected,
} from './interfaces'

type HookActions = OnCreated | OnDestroyed | OnConnect | OnConnected | OnDisconnect | OnDisconnected

export function getHook<T extends HookActions>(
  editor: NodeEditor,
  name: undefined | string,
  method: keyof T
) {
  if (!name) return () => null

  const component = editor.getComponent(name)

  if (typeof method in component) {
    const c = component as unknown as T
    const func = c[method] as unknown as Function

    return func.bind(component)
  }

  return () => null
}

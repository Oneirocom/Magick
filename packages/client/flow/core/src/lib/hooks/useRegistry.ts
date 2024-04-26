import { IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import { useMemo } from 'react'

export const useRegistry = () => {
  return useMemo<IRegistry>(
    () =>
      registerCoreProfile({
        values: {},
        nodes: {},
        dependencies: {},
      }),
    []
  )
}

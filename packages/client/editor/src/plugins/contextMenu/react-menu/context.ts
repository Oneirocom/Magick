// DOCUMENTED

import { createContext } from 'react'

/**
 * Context for handling closure and passing arguments for a certain component.
 *
 * @export
 * @interface CloseArgsContextType
 */
export interface CloseArgsContextType {
  onClose: () => void
  args: unknown
}

/**
 * Create a new context with default values for onClose and args.
 *
 * @remarks
 * This context is used for handling closure and passing arguments for a certain component.
 * The actual implementation of onClose and args should be provided by the consumer of this context.
 */
const CloseArgsContext = createContext<CloseArgsContextType>({
  onClose: () => {
    /* null */
  }, // Default implementation of onClose - does nothing
  args: null, // Default value for args - can be overridden by consumer
})

export default CloseArgsContext

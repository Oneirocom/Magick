import { Application } from '@feathersjs/feathers'
import {
  createSlice,
  PayloadAction,
  Reducer,
  configureStore,
} from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

let globalFeathersClient: Application | null = null

const REGISTER_EVENTS = 'FEATHERS/REGISTER_EVENTS'

type StringKeyof<T> = Extract<keyof T, string>

type ActionNames = StringKeyof<ReturnType<typeof createSlice>['actions']>

type ServiceActionHook<
  ServiceName extends string,
  ActionKey extends string
> = `use${Capitalize<ServiceName>}${Capitalize<ActionKey>}`

type ServiceEventHook<
  ServiceName extends string,
  Event extends string
> = `useSelect${Capitalize<ServiceName>}${Capitalize<Event>}`

interface ServiceConfigType<
  ServiceName extends string = string,
  Events extends string[] = string[]
> {
  name: ServiceName
  initialState?: Record<string, any>
  reducers?: Record<string, (state: any, action: PayloadAction<any>) => void>
  events: Events
}

type HooksReturnType<ServiceName extends string, Events extends string[]> = {
  [K in Events[number] as `useSelect${Capitalize<ServiceName>}${Capitalize<K>}`]: () => {
    data: any[]
    lastItem: any
    error: any
  }
}

type ActionHooks<ServiceName extends string, ActionKeys extends string> = {
  [K in ActionKeys as `use${Capitalize<ServiceName>}${Capitalize<K>}`]: () => (
    payload: any
  ) => void
}

type EventHooks<ServiceName extends string, Events extends string[]> = {
  [E in Events[number] as `useSelect${Capitalize<ServiceName>}${Capitalize<E>}`]: () => {
    data: any[]
    lastItem: any
    error: any
  }
}

type InjectServiceResult<
  ServiceName extends string,
  Events extends string[],
  ActionKeys extends Extract<
    keyof ReturnType<typeof createSlice>['actions'],
    string
  >
> = {
  reducer: Reducer
  actions: ReturnType<typeof createSlice>['actions']
  registerFeathersEvents: () => {
    type: typeof REGISTER_EVENTS
    payload: { serviceName: ServiceName; events: Events }
  }
  hooks: {
    [K in ActionKeys as ServiceActionHook<ServiceName, K>]: () => (
      payload: any
    ) => void
  } & {
    [E in Events[number] as ServiceEventHook<ServiceName, E>]: () => {
      data: any[]
      lastItem: any
      error: any
    }
  }
}

export interface FeathersReduxInitialState {
  data: any[]
  item: any
  loading: boolean
}

export interface ServiceDetails {
  reducer: Reducer
  config: ServiceConfigType
}

const reducers: { [key: string]: ServiceDetails } = {}

/**
 * Generates an action type string based on the service name and event.
 * @param serviceName - The name of the Feathers service.
 * @param event - The name of the event (e.g., "created").
 * @returns The action type string.
 */
const generateActionType = (serviceName: string, event: string): string =>
  `${serviceName}/${event}`

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Registers event listeners for a Feathers service, dispatching Redux actions when those events occur.
 * @param store - The Redux store.
 * @param serviceName - The name of the Feathers service.
 * @param events - An array of event names to listen to (e.g., ["created", "updated"]).
 */
const registerFeathersServiceEvents = (
  store: { dispatch: (action: AnyAction) => void },
  serviceName: string,
  events: string[]
): void => {
  const service = globalFeathersClient!.service(serviceName)
  events.forEach(event => {
    service.on(event, data => {
      const actionType = generateActionType(serviceName, event)
      store.dispatch({ type: actionType, payload: data })
    })
  })
}

/**
 * Redux middleware for registering Feathers service events.
 *
 * @example
 *
 * ```typescript
 * import { configureStore } from '@reduxjs/toolkit';
 *
 * // Set up the store with the middleware
 * const store = configureStore({
 *   reducer: rootReducer,
 *   middleware: [feathersEventMiddleware]
 * });
 *
 * // Dispatch an action to register Feathers service events
 * store.dispatch({
 *   type: 'FEATHERS/REGISTER_EVENTS',
 *   payload: {
 *     serviceName: 'myServiceName',
 *     events: ['created', 'updated', 'removed']
 *   }
 * });
 * ```
 *
 * @param {any} storeAPI - The Redux store API.
 * @returns {Function} Middleware function that checks for the 'FEATHERS/REGISTER_EVENTS' action type.
 */
export const feathersEventMiddleware =
  (storeAPI: any) => (next: any) => (action: AnyAction) => {
    if (action.type === REGISTER_EVENTS) {
      const { serviceName, events } = action['payload']
      registerFeathersServiceEvents(storeAPI, serviceName, events)
    }
    return next(action)
  }

/**
 * Creates and manages integration between Feathers services and Redux.
 *
 * Example usage:
 * ```typescript
 * const feathersToolkit = createFeathersReduxToolkit(feathersClient);
 * const logsService = feathersToolkit.injectService({ name: 'logs', events: ['created', 'updated'] });
 * ```
 *
 * @param client - The Feathers client instance.
 * @returns An object containing methods to integrate Feathers and Redux.
 */
export const createFeathersReduxToolkit = (client: Application) => {
  globalFeathersClient = client

  return {
    /**
     * Integrates a Feathers service with Redux by creating a slice, generating hooks, and storing service details.
     *
     * Example usage:
     * ```typescript
     * const logsService = feathersToolkit.injectService({ name: 'logs', events: ['created', 'updated'] });
     * const { useLogsCreated, useSelectLogs } = logsService.hooks;
     * ```
     *
     * @param serviceConfig - Configuration for the Feathers service.
     * @returns An object containing the Redux reducer, actions, and hooks for the service.
     */
    injectService<ServiceName extends string, Events extends string[]>(
      serviceConfig: ServiceConfigType<ServiceName, Events>
    ): InjectServiceResult<ServiceName, Events, ActionNames> {
      const defaultState: { [key: string]: any } = {}

      const {
        name,
        initialState = defaultState,
        reducers: serviceReducers = {},
        events,
      } = serviceConfig

      // Add default state for each event
      events.forEach(event => {
        defaultState[event] = {
          data: [],
          lastItem: null,
          error: null,
        }
      })

      /**
       * Creates a slice for a Feathers service with the given name, initial state, and service reducers.
       * Also adds extra reducers for each event in the events array.
       * @param name - The name of the Feathers service.
       * @param initialState - The initial state of the slice.
       * @param serviceReducers - The service reducers to be included in the slice.
       * @param events - The events array to add extra reducers for.
       * @returns A slice object with the specified name, initial state, and reducers.
       */
      const slice = createSlice({
        name,
        initialState,
        reducers: serviceReducers,
        extraReducers: builder => {
          events.forEach(event => {
            const actionType = generateActionType(name, event)
            builder.addCase(actionType, (state, action: PayloadAction<any>) => {
              ;(state['data'][event] as any[]).push(action.payload)
              ;(state as any).lastItem = action.payload
            })
          })
        },
      })

      // Add the service reducers to the slice
      reducers[name] = {
        reducer: slice.reducer,
        config: serviceConfig,
      }

      const actionHooks: ActionHooks<ServiceName, ActionNames> = {} as any
      const eventHooks: EventHooks<ServiceName, Events> = {} as any

      Object.keys(slice.actions).forEach(actionKey => {
        const hookName = `use${capitalize(name)}${capitalize(actionKey)}`
        actionHooks[hookName] = () => {
          const dispatch = useDispatch()
          return (payload: any) => dispatch(slice.actions[actionKey](payload))
        }
      })

      events.forEach(event => {
        const selectEventHookName = `useSelect${capitalize(name)}${capitalize(
          event
        )}`
        eventHooks[selectEventHookName] = () => {
          const eventState = useSelector((state: any) => state[name][event])
          return {
            data: eventState.data,
            lastItem: eventState.lastItem,
            error: eventState.error,
          }
        }
      })
      return {
        actions: slice.actions,
        reducer: slice.reducer,
        registerFeathersEvents: () => ({
          type: REGISTER_EVENTS,
          payload: { serviceName: name, events },
        }),
        hooks: {
          ...actionHooks,
          ...eventHooks,
        },
      }
    },

    /**
     * Registers Feathers events for all injected services.
     * This is typically called after store creation to ensure that all services are listening to their respective events.
     *
     * Example usage:
     * ```typescript
     * const store = configureStore({ reducer: feathersToolkit.getReducers() });
     * feathersToolkit.registerFeathersEvents(store);
     * ```
     *
     * @param store - The Redux store.
     */
    registerFeathersEvents: (store: {
      dispatch: (action: AnyAction) => void
    }) => {
      Object.entries(reducers).forEach(([serviceName, serviceDetails]) => {
        registerFeathersServiceEvents(
          store,
          serviceName,
          serviceDetails.config.events
        )
      })
    },

    /**
     * Retrieves the Redux reducers for all injected services.
     *
     * Example usage:
     * ```typescript
     * const rootReducer = feathersToolkit.getReducers();
     * const store = configureStore({ reducer: rootReducer });
     * ```
     *
     * @returns An object containing the reducers for all injected services.
     */
    getReducers: () => {
      const extractedReducers: { [key: string]: Reducer } = {}
      Object.keys(reducers).forEach(key => {
        extractedReducers[key] = reducers[key].reducer
      })
      return extractedReducers
    },

    /**
     * Configures the Redux store and automatically registers the Feathers service events.
     *
     * @example
     *
     * ```typescript
     * const feathersToolkit = createFeathersReduxToolkit(feathersClient);
     * const store = feathersToolkit.configureFeathersStore({
     *   reducer: rootReducer,
     *   middleware: [feathersEventMiddleware, ...getDefaultMiddleware()]
     * });
     * ```
     *
     * @param {Object} config - Configuration options for the Redux store.
     * @returns {Object} The Redux store.
     */
    configureFeathersStore: (config: any) => {
      // Create the store using the provided configuration
      const store = configureStore(config)

      // Dispatch the registration action for each service
      Object.values(reducers).forEach(serviceDetails => {
        store.dispatch({
          type: REGISTER_EVENTS,
          payload: {
            serviceName: serviceDetails.config.name,
            events: serviceDetails.config.events,
          },
        })
      })

      return store
    },
  }
}

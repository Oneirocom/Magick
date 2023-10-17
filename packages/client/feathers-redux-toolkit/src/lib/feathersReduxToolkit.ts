import { Application } from '@feathersjs/feathers'
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

let globalFeathersClient: Application | null = null

interface InitialState {
  data: any[]
  item: any
  loading: boolean
}

interface ServiceConfig {
  name: string
  initialState?: InitialState
  reducers?: {
    [key: string]: (state: any, action: PayloadAction<any>) => any
  }
  events: string[]
}

interface ServiceDetails {
  reducer: Reducer
  config: ServiceConfig
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
    injectService: (serviceConfig: ServiceConfig) => {
      const defaultState = {
        data: [],
        lastItem: null,
      }

      const {
        name,
        initialState = defaultState,
        reducers: serviceReducers = {},
        events = [],
      } = serviceConfig

      const slice = createSlice({
        name,
        initialState,
        reducers: serviceReducers,
        extraReducers: builder => {
          events.forEach(event => {
            const actionType = generateActionType(name, event)
            builder.addCase(actionType, (state, action: PayloadAction<any>) => {
              ;(state.data as any[]).push(action.payload)
              ;(state as any).lastItem = action.payload
            })
          })
        },
      })

      reducers[name] = {
        reducer: slice.reducer,
        config: serviceConfig,
      }

      const generatedHooks: { [key: string]: any } = {}

      Object.keys(slice.actions).forEach(actionKey => {
        const hookName = `use${capitalize(name)}${capitalize(actionKey)}`
        generatedHooks[hookName] = () => {
          const dispatch = useDispatch()
          return (payload: any) => dispatch(slice.actions[actionKey](payload))
        }
      })

      const selectHookName = `useSelect${capitalize(name)}`
      generatedHooks[selectHookName] = () =>
        useSelector((state: any) => state[name])

      return {
        reducer: slice.reducer,
        actions: slice.actions,
        hooks: generatedHooks,
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
  }
}

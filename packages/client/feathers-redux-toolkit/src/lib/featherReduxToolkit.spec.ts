import { createFeathersReduxToolkit } from './feathersReduxToolkit'
import { createStore } from 'redux'

// Improved Mock Application for testing
class MockFeathersApp {
  private listeners: Record<string, Function[]> = {}

  service(serviceName: string) {
    return {
      on: (event: string, callback: Function) => {
        if (!this.listeners[`${serviceName}/${event}`]) {
          this.listeners[`${serviceName}/${event}`] = []
        }
        this.listeners[`${serviceName}/${event}`].push(callback)
      },
    }
  }

  // This function allows the tests to simulate an event being triggered by Feathers
  triggerEvent(serviceName: string, event: string, data: any) {
    const listeners = this.listeners[`${serviceName}/${event}`] || []
    for (const listener of listeners) {
      listener(data)
    }
  }
}

describe('feathersReduxToolkit', () => {
  let toolkit
  let mockFeathersApp: MockFeathersApp

  beforeEach(() => {
    mockFeathersApp = new MockFeathersApp()
    toolkit = createFeathersReduxToolkit(mockFeathersApp as any)
  })

  it('should correctly inject a service', () => {
    const logsService = toolkit.injectService({
      name: 'logs',
      events: ['created', 'updated'],
    })
    expect(logsService).toHaveProperty('reducer')
    expect(logsService).toHaveProperty('actions')
    expect(logsService).toHaveProperty('hooks')
  })

  it('should correctly handle Feathers events', () => {
    // Setup a store to work with
    const mockStore = createStore(state => state)
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch')

    toolkit.injectService({ name: 'logs', events: ['created', 'updated'] })
    toolkit.registerFeathersEvents(mockStore)

    // Simulate an event
    mockFeathersApp.triggerEvent('logs', 'created', { id: 1, text: 'test' })

    // Ensure our store received the event via an action
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'logs/created',
        payload: { id: 1, text: 'test' },
      })
    )
  })

  it('should return the reducers for all injected services', () => {
    toolkit.injectService({ name: 'logs', events: ['created', 'updated'] })
    toolkit.injectService({ name: 'users', events: ['created'] })
    const reducers = toolkit.getReducers()
    expect(reducers).toHaveProperty('logs')
    expect(reducers).toHaveProperty('users')
  })

  it('should correctly handle multiple Feathers events', () => {
    const mockStore = createStore(state => state)
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch')

    toolkit.injectService({ name: 'logs', events: ['created', 'updated'] })
    toolkit.registerFeathersEvents(mockStore)

    mockFeathersApp.triggerEvent('logs', 'created', { id: 1, text: 'test' })
    mockFeathersApp.triggerEvent('logs', 'updated', {
      id: 1,
      text: 'test updated',
    })

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'logs/created',
        payload: { id: 1, text: 'test' },
      })
    )

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'logs/updated',
        payload: { id: 1, text: 'test updated' },
      })
    )
  })

  it('should correctly execute custom reducer logic', () => {
    const customReducer = (state = [], action) => {
      if (action.type === 'logs/updated') {
        return [...state, action.payload]
      }
      return state
    }

    const mockStore = createStore(state => state)
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch')

    toolkit.injectService({
      name: 'logs',
      events: ['created', 'updated'],
      reducer: customReducer,
    })

    toolkit.registerFeathersEvents(mockStore)
    mockFeathersApp.triggerEvent('logs', 'updated', {
      id: 1,
      text: 'test updated',
    })

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'logs/updated',
        payload: { id: 1, text: 'test updated' },
      })
    )

    // For a more extensive test, you'd set up the reducer in an actual store and check the new state after the dispatch.
  })

  it('should handle Feathers errors gracefully', () => {
    // Assuming a simplistic model where an error from Feathers is just another event
    toolkit.injectService({ name: 'logs', events: ['error'] })

    const mockStore = createStore(state => state)
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch')

    toolkit.registerFeathersEvents(mockStore)

    // Simulating an error event
    mockFeathersApp.triggerEvent('logs', 'error', new Error('Test error'))

    // You would validate that the expected error handling logic or actions are dispatched
    // For now, just checking that an error event is dispatched
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'logs/error',
        payload: expect.any(Error),
      })
    )
  })
})

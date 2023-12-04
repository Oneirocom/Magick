import { IStateService } from '@magickml/behave-graph'

class DefaultStateService implements IStateService {
  stateStore: Record<string, any>
  constructor() {
    this.stateStore = {}
  }

  getState(nodeId, graph) {
    console.log('GETTING SERVICE STATE', nodeId)
    // const eventStore = graph.getDependency('IEventStore')

    // if (eventStore) {
    //   const event = eventStore.getCurrentEvent()

    //   const key = `${nodeId}:${event.channel}:${event.sender}`

    //   return this.stateStore[key] || null

    // }

    // const key = `${nodeId}:${event.channel}:${event.sender}`

    return this.stateStore[nodeId] || null
  }

  setState(nodeId, newState, graph) {
    console.log('SETTING SERVICE STATE', nodeId, newState)
    this.stateStore[nodeId] = newState
  }
}

export default DefaultStateService

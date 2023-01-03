import deepEqual from 'deep-equal'
import Rete, { Input, Output } from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { DataSocketType, IRunContextEditor, ThothNode } from '../../../types'
import * as socketMap from '../../sockets'
import { ThothComponent } from '../../thoth-component'
import { DataControl } from './DataControl'

type InspectorConstructor = {
  component: ThothComponent<unknown>
  editor: IRunContextEditor
  node: ThothNode
}

// todo improve this typing
type DataControlData = Record<string, any>

export type InspectorData = {
  name: string
  nodeId: number
  dataControls: Record<string, any>
  data: Record<string, unknown>
  category?: string
  info: string
}

export class Inspector {
  // Stub of function.  Can be a nodes catch all onData
  cache: Record<string, any> = {}
  node: ThothNode
  component: ThothComponent<unknown>
  editor: IRunContextEditor
  dataControls: Map<string, DataControl>
  category: string
  info: string

  constructor({ component, editor, node }: InspectorConstructor) {
    this.component = component
    this.editor = editor
    this.dataControls = new Map()
    this.node = node
    this.category = component.category
    this.info = component.info
  }
  // addede DataControl[]
  _add(list: Map<string, DataControl>, control: DataControl) {
    if (list.has(control.key))
      throw new Error(
        `Item with key '${control.key}' already been added to the inspector`
      )

    if (control['inspector'] !== null)
      throw new Error('Inspector has already been added to some control')

    // Attach the inspector to the incoming control instance
    control['inspector'] = this
    control.editor = this.editor
    control.node = this.node
    control.component = this.component
    control.id = uuidv4()

    // If we gave a dewfault value and there isnt already one on the node, add it.
    if (control.defaultValue && !this.node.data[control.dataKey])
      this.node.data[control.dataKey] = control.defaultValue

    list.set(control.dataKey, control)
  }

  add(dataControl: DataControl) {
    this._add(this.dataControls, dataControl)
    dataControl.onAdd()
    return this
  }

  handleSockets(
    sockets: DataSocketType[],
    control: DataControlData,
    type: 'inputs' | 'outputs'
  ) {
    // we assume all sockets are of the same type here
    // and that the data key is set to 'inputs' or 'outputs'
    const isOutput = type === 'outputs'

    this.node.data[type] = sockets

    // get all sockets currently on the node
    const existingSockets: string[] = []

    this.node[type]?.forEach(out => {
      existingSockets.push(out.key)
    })

    const ignored: string[] = (control && control?.data?.ignored) || []

    // outputs that are on the node but not in the incoming sockets is removed
    existingSockets
      .filter(
        existing => !sockets.some(incoming => incoming.socketKey === existing)
      )
      // filter out any sockets which we have set to be ignored
      .filter(existing => {
        console.log('filtering out existing')
        return (
          ignored.length === 0 || !ignored.some(socket => socket === existing)
        )
      })
      // iterate over each socket after this to remove is
      .forEach(key => {
        const socket = this.node[type].get(key)

        if (!socket) return

        // we get the connections for the node and remove that connection
        const connections = this.node
          .getConnections()
          .filter(
            con => con[type.slice(0, -1) as 'input' | 'output'].key === key
          )

        if (connections)
          connections.forEach(con => {
            this.editor.removeConnection(con)
          })

        // handle removing the socket, either output or input
        if (isOutput) {
          this.node.removeOutput(socket as Output)
        } else {
          this.node.removeInput(socket as Input)
        }
      })

    // any incoming outputs not on the node already are new and will be added.
    const newSockets = sockets.filter(
      socket => !existingSockets.includes(socket.socketKey)
    )

    // Here we are running over and ensuring that the outputs are in the tasks outputs
    // We only need to do this with outputs, as inputs don't need to be in the task
    if (isOutput) {
      const dataOutputs = this.node.data.outputs as DataSocketType[]
      this.component.task.outputs = dataOutputs.reduce(
        (acc, out) => {
          acc[out.socketKey] = out.taskType || 'output'
          return acc
        },
        { ...this.component.task.outputs }
      )
    }

    // Iterate over any new sockets and add them
    newSockets.forEach(socket => {
      // get the right constructor method for the socket
      const SocketConstructor = isOutput ? Rete.Output : Rete.Input

      // use the provided information from the socket to generate it
      const newSocket = new SocketConstructor(
        socket.useSocketName ? socket.name : socket.socketKey || socket.name,
        socket.name,
        socketMap[socket.socketType],
        socket.socketType === 'triggerSocket' || isOutput
      )

      if (isOutput) {
        this.node.addOutput(newSocket as Output)
      } else {
        this.node.addInput(newSocket as Input)
      }
    })
  }

  cacheControls(dataControls: DataControlData) {
    const cache = Object.entries(dataControls).reduce(
      (acc, [key, { expanded = true }]) => {
        acc[key] = {
          expanded,
        }

        return acc
      },
      {} as Record<string, any>
    )

    this.node.data.dataControls = cache
  }

  handleDefaultTrigger(update: Record<string, any>) {
    this.editor.nodes
      .filter((node: ThothNode) => node.name === 'Trigger In')
      .map((node: ThothNode) => {
        if (node.data.isDefaultTriggerIn) {
          node.data.isDefaultTriggerIn = !node.data.isDefaultTriggerIn
        }
      })

    this.node.data.isDefaultTriggerIn = update.data.isDefaultTriggerIn
  }

  handleData(update: Record<string, any>) {
    // store all data controls inside the nodes data
    // WATCH in case our graphs start getting quite large.
    if (update.dataControls) this.cacheControls(update.dataControls)

    const { data } = update

    this.handleDefaultTrigger(update)

    // Send data to a possibel node global handler
    // Turned off until the pattern might be useful
    // this.onData(data)

    // go over each data control
    const dataControlArray = Array.from(this.dataControls)
    for (const [key, control] of dataControlArray) {
      const isEqual = deepEqual(this.cache[key], data[key])

      // compare agains the cache to see if it has changed
      if (isEqual) continue

      // Write the data to the node, unless the control has specified otherwise
      if (control.write)
        this.node.data = {
          ...this.node.data,
          [key]: data[key],
        }

      // if there is inputs in the data, only handle the incoming sockets
      if (key === 'inputs' && data['inputs']) {
        this.handleSockets(data['inputs'], control.control, 'inputs')
        continue
      }

      // if there is outputs in the data, only handle the incoming sockets
      if (key === 'outputs' && data['outputs']) {
        this.handleSockets(data['outputs'], control.control, 'outputs')
        continue
      }

      if (data[key]) {
        // handle the situation where a control is setting inputs and outputs itself
        if (data[key].outputs) {
          this.handleSockets(data[key].outputs, control.control, 'outputs')
        }

        if (data[key].inputs) {
          this.handleSockets(data[key].inputs, control.control, 'inputs')
        }
      }

      // only call onData if it exists
      if (!control?.onData) continue

      control.onData(data[key])
    }

    this.cache = data

    // update the node at the end ofthid
    this.node.update()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.editor.trigger('save')
  }

  get() {}

  // returns all data prepared for the pubsub to send it.
  data(): InspectorData {
    const dataControls = Array.from(this.dataControls.entries()).reduce(
      (acc, [key, val]) => {
        const cache = this.node?.data?.dataControls as DataControlData
        const cachedControl = cache && cache[key] ? cache[key] : {}
        // use the data method on controls to get data shape
        acc[key] = { ...val.control, ...cachedControl }
        return acc
      },
      {} as Record<string, any>
    )

    return {
      name: this.node.displayName || this.node.name,
      nodeId: this.node.id,
      dataControls,
      data: this.node.data,
      category: this.node.category,
      info: this.node.info,
    }
  }

  remove() {}
}

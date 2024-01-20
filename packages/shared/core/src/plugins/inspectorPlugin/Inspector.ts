import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { Input, Output } from 'rete'

import { MagickComponent } from '../../engine'
import * as socketMap from '../../sockets'
import {
  AsDataSocket,
  AsInputsAndOutputsData,
  ControlData,
  DataSocketType,
  IRunContextEditor,
  MagickNode,
  PubSubData,
  WorkerData,
} from '../../types'
import { DataControl } from './DataControl'

type InspectorConstructor = {
  component: MagickComponent<unknown>
  editor: IRunContextEditor
  node: MagickNode
}

// todo improve this typing
export type DataControlData = Record<string, ControlData>

export type InspectorData = {
  name: string
  nodeId: number
  dataControls: DataControlData
  data: WorkerData
  category?: string
  info: string
}

export type HandleDataArgs = {
  dataControls?: DataControlData
  data: PubSubData
}

export class Inspector {
  // Stub of function.  Can be a nodes catch all onData
  cache: PubSubData = {}
  node: MagickNode
  component: MagickComponent<unknown>
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
    if (list.has(control.dataKey))
      return console.error(
        `Item with dataKey '${control.dataKey}' already been added to the inspector`
      )

    if (control['inspector'] !== null)
      return console.error('Inspector has already been added to some control')

    // Attach the inspector to the incoming control instance
    control['inspector'] = this
    control.editor = this.editor
    control.node = this.node
    control.component = this.component
    control.id = uuidv4()

    // If we gave a default value and there isnt already one on the node, add it.
    if (control.defaultValue !== null && !this.node.data[control.dataKey])
      this.node.data[control.dataKey] = control.defaultValue

    // add tooltip to the control
    control.tooltip = control.tooltip || ''

    list.set(control.dataKey, control)
  }

  add(dataControl: DataControl) {
    this._add(this.dataControls, dataControl)
    dataControl.onAdd()
    return this
  }

  remove(dataKey) {
    const control = this.dataControls.get(dataKey)
    if (!control) {
      return console.warn(`No control with dataKey '${dataKey}' found`)
    }
    control.onRemove()
    this.dataControls.delete(dataKey)
    return this
  }

  add_html(html: string) {
    this.node.data['html'] = html
  }

  add_img(img_url: string) {
    this.node.data['image'] = img_url
  }

  add_func(func: () => void) {
    this.node.data['func'] = func
  }
  handleSockets(
    sockets: DataSocketType[],
    control: DataControl,
    type: 'inputs' | 'outputs'
  ) {
    // we assume all sockets are of the same type here
    // and that the data key is set to 'inputs' or 'outputs'
    const isOutput = type === 'outputs'

    this.node.data[type] = AsInputsAndOutputsData(sockets)

    // get all sockets currently on the node
    const existingSockets: string[] = []

    this.node[type]?.forEach(out => {
      existingSockets.push(out.key)
    })

    const ignored: string[] =
      ((control && control?.data?.ignored) as string[]) || []

    // outputs that are on the node but not in the incoming sockets is removed
    existingSockets
      .filter(
        existing => !sockets.some(incoming => incoming.socketKey === existing)
      )
      // filter out any sockets which we have set to be ignored
      .filter(existing => {
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
          this.node.removeOutput(socket as any)
        } else {
          this.node.removeInput(socket as any)
        }
      })

    // any incoming outputs not on the node already are new and will be added.
    const newSockets = sockets.filter(
      socket => !existingSockets.includes(socket.socketKey)
    )

    // Here we are running over and ensuring that the outputs are in the tasks outputs
    // We only need to do this with outputs, as inputs don't need to be in the task
    if (isOutput) {
      const dataOutputs = AsDataSocket(this.node.data.outputs)
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
      const SocketConstructor = isOutput ? Output : Input

      // use the provided information from the socket to generate it
      const newSocket = new SocketConstructor(
        socket.useSocketName ? socket.name : socket.socketKey || socket.name,
        socket.name,
        socketMap[socket.socketType],
        socket.socketType === 'triggerSocket' || isOutput
      )

      if (isOutput) {
        this.node.addOutput(newSocket as any)
      } else {
        this.node.addInput(newSocket as any)
      }
    })
  }

  handleDefaultTrigger(update: {
    dataControls?: DataControlData
    data: PubSubData
  }) {
    this.editor.nodes
      .filter(node => node.name === 'Input')
      .forEach(node => {
        if (node.data.isDefaultTriggerIn) {
          node.data.isDefaultTriggerIn = !node.data.isDefaultTriggerIn
        }
      })

    if (typeof update.data === 'string') return
    this.node.data.isDefaultTriggerIn = (
      update.data as Record<string, unknown>
    ).isDefaultTriggerIn
  }

  handleData(update: HandleDataArgs) {
    // store all data controls inside the nodes data
    // WATCH in case our graphs start getting quite large.

    const { data } = update

    this.handleDefaultTrigger(update)

    // Send data to a possibel node global handler
    // Turned off until the pattern might be useful
    // this.onData(data)

    // go over each data control
    const dataControlArray = Array.from(this.dataControls)
    for (const [key, control] of dataControlArray) {
      const isEqual = _.isEqual(this.cache[key], data[key])

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
        // TODO: check correctness
        // this.handleSockets(data['inputs'], control.control, 'inputs')
        this.handleSockets(data['inputs'], control, 'inputs')

        continue
      }

      // if there is outputs in the data, only handle the incoming sockets
      if (key === 'outputs' && data['outputs']) {
        // TODO: check correctness
        // this.handleSockets(data['outputs'], control.control, 'outputs')
        this.handleSockets(data['outputs'], control, 'outputs')
        continue
      }

      if (data[key]) {
        // handle the situation where a control is setting inputs and outputs itself
        if (data[key].outputs) {
          // TODO: check correctness
          this.handleSockets(data[key].outputs, control, 'outputs')
        }

        if (data[key].inputs) {
          // TODO: check correctness
          this.handleSockets(data[key].inputs, control, 'inputs')
        }
      }

      // only call onData if it exists
      if (!control?.onData) continue

      control.onData(data[key])
    }

    this.cache = data

    // update the node at the end ofthid
    this.node.update()

    // this.editor?.trigger('save')
  }

  get() {
    return
  }

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
      {} as Record<string, ControlData>
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
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Control } from 'rete'

const ReactRunButton = props => {
  const onButton = () => {
    const node = props.getNode()
    props.emitter.trigger('run', { nodeId: node.id })
  }

  return <button onClick={onButton}>RUN</button>
}

export class RunButtonControl extends Control {
  constructor({ key, emitter, run }) {
    super(key)
    this.render = 'react'
    this.key = key
    this.component = ReactRunButton

    // we define the props that are passed into the rendered react component here
    this.props = {
      emitter,
      run,
      getNode: this.getNode.bind(this),
    }
  }

  getNode() {
    return this.parent
  }
}

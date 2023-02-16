// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Control } from 'rete'

const ReactRunButton = props => {
  const onButton = async () => {
    const nodeData = props.getNode().toJSON()
    const value = await props.run(nodeData)
    console.log('Run with last arguments', value)
  }

  return (
    <button className="small" onClick={onButton} style={{ maxWidth: '65%' }}>
      Run with last arguments
    </button>
  )
}

export class RunButtonControl extends Control {
  constructor({ key, run }) {
    super(key)
    this.render = 'react'
    this.key = key
    this.component = ReactRunButton

    // we define the props that are passed into the rendered react component here
    this.props = {
      run,
      getNode: this.getNode.bind(this),
    }
  }

  getNode() {
    return this.parent
  }
}

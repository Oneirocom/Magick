import { Control, Input, Node, Socket } from '../src'
import assert from 'assert'

class MyControl extends Control {
  constructor(key?: any) {
    super(key)
  }
}

describe('Control', () => {
  it('init', () => {
    assert.throws(() => new Control('test'), 'abstract class')
    assert.throws(() => new MyControl(), 'key required')
    assert.doesNotThrow(() => new MyControl('test'), 'simple control')
  })

  it('add to node', () => {
    const node = new Node('test')
    const ctrl = new MyControl('test')

    assert.throws(() => ctrl.getNode())

    node.addControl(ctrl)

    assert.doesNotThrow(() => ctrl.getNode())
  })

  it('add to input', () => {
    const socket = new Socket('test')
    const input = new Input('key', 'Text', socket)
    const node = new Node('test')
    const ctrl = new MyControl('test')

    input.addControl(ctrl)

    assert.throws(() => ctrl.getNode(), 'node not found')

    node.addInput(input)

    assert.doesNotThrow(() => ctrl.getNode(), 'node should be added')

    node.data.testKey = 1
    assert.strictEqual(ctrl.getData('testKey'), 1, 'data testKey exist')

    assert.doesNotThrow(() => ctrl.putData('testKey2', 2), 'data added')
    assert.strictEqual(ctrl.getData('testKey2'), 2, 'data testKey2 exist')
  })
})

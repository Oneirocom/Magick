import { Component as ComponentWorker } from './engine/component'
import { Node } from './node'
import { NodeEditor } from './editor'

export abstract class Component extends ComponentWorker {
  editor: NodeEditor | null = null
  override data: unknown = {}

  constructor(name: string) {
    super(name)
  }

  abstract builder(node: Node): Promise<void>

  async build(node: Node) {
    await this.builder(node)

    return node
  }

  async createNode(data = {}) {
    const node = new Node(this.name)

    node.data = data
    await this.build(node)

    return node
  }
}

// DOCUMENTED
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { documentSocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

// Information about the component
const info =
  'Join an array of document content into a string formatted for prompt injection.'

type WorkerReturn = {
  content: string
}

/**
 * EventsToConversation component, responsible for converting an array of events into a conversation string.
 */
export class DocumentToContent extends MagickComponent<WorkerReturn> {
  constructor() {
    // Name of the component and its output sockets definition
    super(
      'Document to Content',
      {
        outputs: {
          content: 'output',
          trigger: 'option',
        },
      },
      'Storage/Events',
      info
    )
    this.common = true
  }

  /**
   * Builds the node component, adding necessary inputs and outputs.
   * @param node - The MagickNode to be built.
   * @returns The built node with the appropriate inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const out = new Rete.Output('content', 'Content', stringSocket)
    const inputList = new Rete.Input('documents', 'Documents', documentSocket)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addInput(inputList)
  }

  /**
   * Worker method that performs the main logic of the component, converting events to conversation string.
   * @param node - The worker data for the current node.
   * @param inputs - The current inputs of the node.
   * @returns An object containing the resulting conversation string.
   */
  worker(
    node: WorkerData,
    inputs: MagickWorkerInputs & { documents: unknown[] }
  ): WorkerReturn {
    const documents = inputs.documents[0]
    let content = ''

    if (Array.isArray(documents)) {
      // @ts-ignore
      if (documents.rows) {
        // @ts-ignore
        documents.rows.forEach((document: { content: string }) => {
          content += '\n' + document.content + '\n'
        })
        return {
          content,
        }
      }

      if (documents) {
        documents.forEach((document: { content: string }) => {
          content += document.content + '\n'
        })
      }
    } else {
      type Document = { content: string }
      content += (documents as Document).content + '\n'
    }

    return {
      content,
    }
  }
}

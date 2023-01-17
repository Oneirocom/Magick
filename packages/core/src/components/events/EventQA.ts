import Rete from 'rete'
import {
    EngineContext,
    NodeData,
    MagickNode,
    MagickWorkerInputs,
    MagickWorkerOutputs,
  } from '../../../types'
  import { triggerSocket, anySocket } from '../../sockets'
  import { MagickComponent } from '../../magick-component'
import { response } from 'express'
  
  const info = 'Event Q&A is used for getting answers to questions based on the events stored.'
  
  type WorkerReturn = {
    output: string
  }

  export class EventQA extends MagickComponent<Promise<WorkerReturn>>{
    constructor(){
      super('Event QA')
      this.task = {
        outputs: {
          output: 'output',
          trigger: 'option'
        },
      }

      this.category = 'Events'
      this.display = true
      this.info = info
      this.runFromCache = true
    }

    builder(node: MagickNode) {
      const idInput = new Rete.Input('question','Question', anySocket)
      const dataInput = new Rete.Input('trigger','Tirgger',triggerSocket, true)
      const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
      const output = new Rete.Output('output', 'Output', anySocket)
      return node
             .addInput(idInput)
             .addInput(dataInput)
             .addOutput(dataOutput)
             .addOutput(output)
    }

    async worker(
      node: NodeData,
      inputs: MagickWorkerInputs,
      _outputs: MagickWorkerOutputs,
      { magick }: { magick: EngineContext }
    ){

      const { eventQAWeaviate } = magick

      const question = inputs['question'][0] as string
      const body = {
        question
      }
      const response = await eventQAWeaviate(body)
      var result
      if (!(response['_additional']['answer']['hasAnswer'])){
        result = "No Mathching events found"
      } else {
        result = response['_additional']['answer']['result']
      }
      return {
        output: result
      }
    }
  }
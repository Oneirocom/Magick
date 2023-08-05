// DOCUMENTED
import Rete from 'rete'
import { MagickComponent } from '../../engine'
import { pluginManager } from '../../plugin'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import {
  CompletionProvider,
  EngineContext,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'

/** Information related to GetCurrentForecast */
const info =
  'Takes in a city, state, and country code and returns the current weather for that location.'
  
/** Type definition for the worker return */
type WorkerReturn = {
  result?: object
}

/**
 * GenerateText component responsible for generating text using any providers
 * available in Magick.
 */
export class GetCurrentForecast extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Get Current Forecast',
      {
        outputs: {
          result: 'output',
          trigger: 'option',
        },
      },
      'Weather',
      info
    )
  }

  /**
   * Builder for generating text.
   * @param node - the MagickNode instance.
   * @returns a configured node with data generated from providers.
   */
  builder(node: MagickNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const location = new Rete.Input('city', 'City', stringSocket)
    const stateCode = new Rete.Input('state', 'State Code', stringSocket)
    const countryCode = new Rete.Input('country', 'Country Code', stringSocket)
    const out = new Rete.Output('result', 'Result', arraySocket)

    const unitsControl = new DropdownControl({
      name: 'Units',
      dataKey: 'units',
      values: ['standard', 'metric', 'imperial'],
      defaultValue: 'imperial',
      tooltip: 'Choose the units for the weather data.',
    })

    node
      .addInput(triggerInput)
      .addInput(location)
      .addInput(stateCode)
      .addInput(countryCode)
      .addOutput(triggerOutput)
      .addOutput(out)
    node.inspector.add(unitsControl)
    return node
  }

  /**
   * Worker for processing the generated text.
   * @param node - the worker data.
   * @param inputs - worker inputs.
   * @param outputs - worker outputs.
   * @param context - engine context.
   * @returns an object with the success status and result or error message.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: {
      module: unknown
      secrets: Record<string, string>
      projectId: string
      context: EngineContext
    }
  ) {
    // get completion providers for text and chat categories
    const completionProviders = pluginManager.getCompletionProviders(
      'weather',
      ['forecast']
    ) as CompletionProvider[]

    const provider = completionProviders[0]
    const completionHandler = provider.handler

    if (!completionHandler) {
      console.error('No completion handler found for provider', provider)
      throw new Error('ERROR: Completion handler undefined')
    }

    const { success, result, error } = await completionHandler({
      node,
      inputs,
      outputs,
      context,
    })
    if (!success) {
      throw new Error('ERROR: ' + error)
    }

    return {
      result: result as object,
    }
  }
}

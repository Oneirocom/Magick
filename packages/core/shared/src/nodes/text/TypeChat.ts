// DOCUMENTED
import Rete from 'rete'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { MagickComponent } from '../../engine'
import { pluginManager } from '../../plugin'
import { triggerSocket } from '../../sockets'
import {
  CompletionInspectorControls,
  CompletionProvider,
  CompletionSocket,
  EngineContext,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'

/** Information related to the TypeChat */
const info =
  'Takes a string input, a typescript inferfaces string input, and a response type string and generates an AI text completion which is output as an object.'

/** Type definition for the worker return */
type WorkerReturn = {
  result?: object
}

/**
 * TypeChat component responsible for generating text using any providers
 * available in Magick.
 */
export class TypeChat extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'TypeChat',
      {
        outputs: {
          result: 'output',
          trigger: 'option',
        },
      },
      'Text',
      info
    )
  }

  /**
   * Builder for TypeChat.
   * @param node - the MagickNode instance.
   * @returns a configured node with data generated from providers.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    // get completion providers for the typeChat subtype
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'typeChat',
    ]) as CompletionProvider[]

    // get the models from the completion providers and flatten into a single array
    const models = completionProviders.map(provider => provider.models).flat()

    const modelName = new DropdownControl({
      name: 'Model Name',
      dataKey: 'model',
      values: models,
      defaultValue: models[0],
      tooltip: 'Choose model name',
    })

    const responseType = new InputControl({
      name: 'Response Type',
      dataKey: 'responseType',
      tooltip: 'Enter response type from your schema',
    })

    const fewshotControl = new FewshotControl({
      tooltip: 'Open schema',
      language: 'typescript',
      name: 'Schema',
      dataKey: 'schema',
      defaultValue: 
`// The following is a schema definition for ordering lattes.
export interface Cart {
  items: (LineItem | UnknownText)[];
}

// Use this type for order items that match nothing else
export interface UnknownText {
  type: 'unknown',
  text: string; // The text that wasn't understood
}

export interface LineItem {
  type: 'lineitem',
  product: Product;
  quantity: number;
}

export type Product = BakeryProducts | LatteDrinks | EspressoDrinks | CoffeeDrinks;

export interface BakeryProducts {
  type: 'BakeryProducts';
  name: 'apple bran muffin' | 'blueberry muffin' | 'lemon poppyseed muffin' | 'bagel';
  options: (BakeryOptions | BakeryPreparations)[];
}

export interface BakeryOptions {
  type: 'BakeryOptions';
  name: 'butter' | 'strawberry jam' | 'cream cheese';
  optionQuantity?: OptionQuantity;
}

export interface BakeryPreparations {
  type: 'BakeryPreparations';
  name: 'warmed' | 'cut in half';
}

export interface LatteDrinks {
  type: 'LatteDrinks';
  name: 'cappuccino' | 'flat white' | 'latte' | 'latte macchiato' | 'mocha' | 'chai latte';
  temperature?: CoffeeTemperature;
  size?: CoffeeSize;  // The default is 'grande'
  options?: (Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations)[];
}

export interface EspressoDrinks {
  type: 'EspressoDrinks';
  name: 'espresso' | 'lungo' | 'ristretto' | 'macchiato';
  temperature?: CoffeeTemperature;
  size?: EspressoSize;  // The default is 'doppio'
  options?: (Creamers | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations)[];
}

export interface CoffeeDrinks {
  type: 'CoffeeDrinks';
  name: 'americano' | 'coffee';
  temperature?: CoffeeTemperature;
  size?: CoffeeSize;  // The default is 'grande'
  options?: (Creamers | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations)[];
}

export interface Syrups {
  type: 'Syrups';
  name: 'almond syrup' | 'buttered rum syrup' | 'caramel syrup' | 'cinnamon syrup' | 'hazelnut syrup' |
      'orange syrup' | 'peppermint syrup' | 'raspberry syrup' | 'toffee syrup' | 'vanilla syrup';
  optionQuantity?: OptionQuantity;
}

export interface Caffeines {
  type: 'Caffeines';
  name: 'regular' | 'two thirds caf' | 'half caf' | 'one third caf' | 'decaf';
}

export interface Milks {
  type: 'Milks';
  name: 'whole milk' | 'two percent milk' | 'nonfat milk' | 'coconut milk' | 'soy milk' | 'almond milk' | 'oat milk';
}

export interface Creamers {
  type: 'Creamers';
  name: 'whole milk creamer' | 'two percent milk creamer' | 'one percent milk creamer' | 'nonfat milk creamer' |
      'coconut milk creamer' | 'soy milk creamer' | 'almond milk creamer' | 'oat milk creamer' | 'half and half' |
      'heavy cream';
}

export interface Toppings {
  type: 'Toppings';
  name: 'cinnamon' | 'foam' | 'ice' | 'nutmeg' | 'whipped cream' | 'water';
  optionQuantity?: OptionQuantity;
}

export interface LattePreparations {
  type: 'LattePreparations';
  name: 'for here cup' | 'lid' | 'with room' | 'to go' | 'dry' | 'wet';
}

export interface Sweeteners {
  type: 'Sweeteners';
  name: 'equal' | 'honey' | 'splenda' | 'sugar' | 'sugar in the raw' | 'sweet n low' | 'espresso shot';
  optionQuantity?: OptionQuantity;
}

export type CoffeeTemperature = 'hot' | 'extra hot' | 'warm' | 'iced';

export type CoffeeSize = 'short' | 'tall' | 'grande' | 'venti';

export type EspressoSize = 'solo' | 'doppio' | 'triple' | 'quad';

export type OptionQuantity = 'no' | 'light' | 'regular' | 'extra' | number;`,
    })

    node.inspector.add(modelName).add(fewshotControl).add(responseType)

    node.addInput(dataInput).addOutput(dataOutput)

    let lastInputSockets: CompletionSocket[] | undefined = []
    let lastOutputSockets: CompletionSocket[] | undefined = []
    let lastInspectorControls: CompletionInspectorControls[] | undefined = []

    /**
     * Configure the provided node according to the selected model and provider.
     */
    const configureNode = () => {
      const model = node.data.model as string
      const provider = completionProviders.find(provider =>
        provider.models.includes(model)
      ) as CompletionProvider
      const inspectorControls = provider.inspectorControls
      const inputSockets = provider.inputs
      const outputSockets = provider.outputs
      const connections = node.getConnections()

      // update inspector controls
      if (inspectorControls !== lastInspectorControls) {
        lastInspectorControls?.forEach(control => {
          node.inspector.dataControls.delete(control.dataKey)
        })
        inspectorControls?.forEach(control => {
          const _control = new control.type(control)
          node.inspector.add(_control)
        })
        lastInspectorControls = inspectorControls
      }
      // update input sockets
      if (inputSockets !== lastInputSockets) {
        lastInputSockets?.forEach(socket => {
          if (node.inputs.has(socket.socket)) {
            connections.forEach(c => {
              if (c.input.key === socket.socket)
                this.editor?.removeConnection(c)
            })

            node.inputs.delete(socket.socket)
          }
        })
        inputSockets.forEach(socket => {
          node.addInput(new Rete.Input(socket.socket, socket.name, socket.type))
        })
        lastInputSockets = inputSockets
      }
      // update output sockets
      if (outputSockets !== lastOutputSockets) {
        lastOutputSockets?.forEach(socket => {
          if (node.outputs.has(socket.socket))
            node.outputs.delete(socket.socket)
        })
        outputSockets.forEach(socket => {
          node.addOutput(
            new Rete.Output(socket.socket, socket.name, socket.type)
          )
        })
        lastOutputSockets = outputSockets
      }
    }

    modelName.onData = (value: string) => {
      node.data.model = value
      configureNode()
    }

    if (!node.data.model) node.data.model = models[0]
    configureNode()
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
    // get completion providers for the typeChat subtype
    const completionProviders = pluginManager.getCompletionProviders('text', [
      'typeChat',
    ]) as CompletionProvider[]

    const model = (node.data as { model: string }).model as string
    const provider = completionProviders.find(provider =>
      provider.models.includes(model)
    ) as CompletionProvider
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
    console.log('result', result)
    if (!success) {
      throw new Error('ERROR: ' + error)
    }

    return {
      result: result as object,
    }
  }
}

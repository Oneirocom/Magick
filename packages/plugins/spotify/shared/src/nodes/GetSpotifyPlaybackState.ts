import Rete from 'rete'
import {
  MagickNode,
  MagickWorkerInputs,
  stringSocket,
  triggerSocket,
  MagickComponent,
  WorkerData,
  MagickWorkerOutputs,
  ModuleContext,
  objectSocket,
} from '@magickml/core'
import { PlaybackState } from '@spotify/web-api-ts-sdk'
import { spotifyGetPlaybackState } from '../functions/spotifyGetPlaybackState'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  playbackState?: PlaybackState
}

/**
 * spotify Google component.
 * @extends MagickComponent<Promise<WorkerReturn>>
 */
export class GetSpotifyPlaybackState extends MagickComponent<
  Promise<WorkerReturn>
> {
  /**
   * Constructor for spotifyGoogle component.
   */
  constructor() {
    super(
      'Get Spotify Playback State',
      {
        outputs: {
          playbackState: 'output',
          trigger: 'option',
        },
      },
      'Music',
      info
    )
  }

  /**
   * Builds the spotifyGoogle node.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - A MagickNode with configured inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const query = new Rete.Input('query', 'Query', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const playbackState = new Rete.Output(
      'playbackState',
      'Playback State',
      objectSocket
    )

    node
      .addInput(triggerIn)
      .addInput(query)
      .addOutput(triggerOut)
      .addOutput(playbackState)

    return node
  }

  /**
   * Main worker function, executes the business logic of the component.
   * @param {WorkerData} node - The worker data.
   * @param {MagickWorkerInputs} inputs - The inputs to the worker.
   * @returns {Promise<WorkerReturn>} - A promise resolving to the worker result.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const { success, playbackState, error } = await spotifyGetPlaybackState({
      node,
      inputs,
      outputs,
      context,
    })

    if (!success) {
      throw new Error(error || 'No error message returned.')
    }

    return {
      playbackState,
    }
  }
}

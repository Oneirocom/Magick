// DOCUMENTED 
import Rete from "rete";
import { API_ROOT_URL } from "../../../config";
import { stringSocket, triggerSocket } from "../../../sockets";
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from "../../../types";
import { MagickComponent } from "../../../engine";

const info =
  "Leverages the current Automatic1111 build of Stable Diffusion (https://github.com/automatic1111/stable-diffusion-webui) and takes an input string and arbitrary labels and returns the most likely label";

/**
 * Input return data type interface
 */
type InputReturn = {
  output: unknown;
};

/**
 * Fetch the prompt from the specified server
 * @param {string} prompt - The input string to generate the image.
 * @param {string} server - The target server URL.
 * @returns {Promise<InputReturn>} - The result image as a JSON object.
 */
async function getPrompt(prompt: string, server: string): Promise<InputReturn> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    prompt,
    sampler_name: "Euler a",
    batch_size: 1,
    n_iter: 1,
    steps: 50,
    cfg_scale: 7,
    width: 256,
    height: 256,
    tiling: false,
    sampler_index: "Euler",
  });

  const r = await fetch(server, {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }).catch((error) => console.log("error", error));

  const j = await (r as Response).json();
  console.log("j is", j);
  return j;
}

/**
 * Image generation component class, using MagickComponent
 */
export class ImageGeneration extends MagickComponent<Promise<InputReturn>> {
  /**
   * ImageGeneration constructor
   */
  constructor() {
    super(
      "Generate Image",
      {
        outputs: {
          trigger: "option",
          output: "output",
        },
      },
      "Image",
      info
    );
  }

  /**
   * Set up the Rete node for this component
   * @param {MagickNode} node - The node to be set up.
   * @returns {MagickNode} - Returns node after modifications.
   */
  builder(node: MagickNode): MagickNode {
    const promptInput = new Rete.Input(
      "prompt",
      "Prompt",
      stringSocket,
      true
    );
    const endpointInput = new Rete.Input(
      "endpoint",
      "Endpoint",
      stringSocket
    );
    const triggerInput = new Rete.Input(
      "trigger",
      "Trigger",
      triggerSocket,
      true
    );
    const dataOutput = new Rete.Output("trigger", "Trigger", triggerSocket);
    const output = new Rete.Output("output", "Output", stringSocket, true);

    return node
      .addInput(triggerInput)
      .addInput(promptInput)
      .addInput(endpointInput)
      .addOutput(dataOutput)
      .addOutput(output);
  }

  /**
   * Worker function to handle inputs and outputs for the ImageGeneration
   * @param {WorkerData} node - The worker data.
   * @param {MagickWorkerInputs} inputs - The inputs for the worker.
   * @param {MagickWorkerOutputs} _outputs - The outputs for the worker.
   * @returns {Promise<InputReturn>} - The input result.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<InputReturn> {
    const prompt = inputs["prompt"] && inputs["prompt"][0];
    const endpoint = inputs["endpoint"] && inputs["endpoint"][0];

    const server = endpoint ?? `${API_ROOT_URL}/image_generation`;

    const { images } = await getPrompt(prompt, server);
    const image = images && images[0];

    return { output: image };
  }
}
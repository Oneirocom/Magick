// DOCUMENTED 
import {
  arraySocket,
  CompletionProvider,
  PluginSecret,
  stringSocket,
} from "@magickml/core";

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: "OpenAI API Key",
    key: "openai_api_key",
    global: true,
    getUrl: "https://beta.openai.com/account/api-keys",
  },
];

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: "text",
    subtype: "text",
    inputs: [
      {
        socket: "input",
        name: "Input",
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: "result",
        name: "Result",
        type: stringSocket,
      }
    ],
    models: [
      "Loaded Text Completion Model",
    ],
  },
  {
    type: "text",
    subtype: "embedding",
    inputs: [
      {
        socket: "input",
        name: "Input",
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: "embedding",
        name: "Embedding",
        type: arraySocket,
      }
    ],
    models: ["all-mpnet-base-v2"],
  },
  {
    type: "text",
    subtype: "chat",
    inputs: [
      {
        socket: "system",
        name: "System Directive",
        type: stringSocket,
      },
      {
        socket: "conversation",
        name: "Conversation ",
        type: arraySocket,
      },
      {
        socket: "input",
        name: "Input",
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: "result",
        name: "Result",
        type: stringSocket,
      },
      {
        socket: "error",
        name: "Error",
        type: stringSocket,
      },
    ],
    models: ["Loaded Chat Completion Model"],
  },
];

export default {
  secrets,
  completionProviders,
};
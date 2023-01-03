import { Spell } from '../types'

export default {
  id: '3b7add2b-0f49-4c6b-8db9-18ecbb34602c',
  name: 'like coral',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      '124': {
        id: 124,
        data: {
          name: 'default',
          error: false,
          socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            playtestToggle: { expanded: true },
          },
          playtestToggle: { receivePlaytest: true },
          success: false,
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [{ node: 758, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1556.5668566017482, -114.13292905935491],
        name: 'Module Trigger In',
      },
      '233': {
        id: 233,
        data: {
          name: 'output',
          error: false,
          display:
            'https://aidungeon-images.s3.us-east-2.amazonaws.com/generated_images/7ceeda0b-b9a6-4c8e-a8a8-7f5b32af5c80.png',
          socketKey: 'ba6ed95b-3aac-49e9-91ae-a33f5510c83b',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            sendToPlaytest: { expanded: true },
          },
          sendToPlaytest: true,
          success: false,
        },
        inputs: {
          input: {
            connections: [{ node: 760, output: 'image', data: { pins: [] } }],
          },
          trigger: {
            connections: [{ node: 760, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: { trigger: { connections: [] } },
        position: [-376.65549182217944, -309.8030022739871],
        name: 'Output',
      },
      '646': {
        id: 646,
        data: {
          name: 'input',
          text: 'image',
          socketKey: '3a9cfde5-32a0-4e96-9de7-7571a7a4e784',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            useDefault: { expanded: true },
            playtestToggle: { expanded: true },
          },
          playtestToggle: { receivePlaytest: true },
          display: 'image',
          success: false,
        },
        inputs: {},
        outputs: {
          output: {
            connections: [{ node: 758, input: 'caption', data: { pins: [] } }],
          },
        },
        position: [-1555.1553378286703, -376.7788066492969],
        name: 'Universal Input',
      },
      '758': {
        id: 758,
        data: { success: false },
        inputs: {
          trigger: {
            connections: [{ node: 124, output: 'trigger', data: { pins: [] } }],
          },
          caption: {
            connections: [{ node: 646, output: 'output', data: { pins: [] } }],
          },
        },
        outputs: {
          trigger: {
            connections: [{ node: 760, input: 'trigger', data: { pins: [] } }],
          },
          images: {
            connections: [{ node: 760, input: 'images', data: { pins: [] } }],
          },
        },
        position: [-1133.9388446003131, -290.6268952113074],
        name: 'VisualGeneration',
      },
      '760': {
        id: 760,
        data: {
          code: '\n// inputs: dictionary of inputs based on socket names\n// data: internal data of the node to read or write to nodes data state\n// state: access to the current game state in the state manager window. Return state to update the state.\nfunction worker(inputs, data, state) {\n\n  // Keys of the object returned must match the names \n  // of your outputs you defined.\n  // To update the state, you must return the modified state.\n  return {image: inputs.images[0].imageUrl}\n}\n',
          dataControls: {
            name: { expanded: true },
            inputs: { expanded: true },
            outputs: { expanded: true },
            code: { expanded: true },
          },
          inputs: [
            {
              name: 'images',
              taskType: 'output',
              socketKey: 'images',
              connectionType: 'input',
              socketType: 'anySocket',
            },
          ],
          outputs: [
            {
              name: 'image',
              taskType: 'output',
              socketKey: 'image',
              connectionType: 'output',
              socketType: 'anySocket',
            },
          ],
          display:
            '{"image":"https://aidungeon-images.s3.us-east-2.amazonaws.com/generated_images/7ceeda0b-b9a6-4c8e-a8a8-7f5b32af5c80.png"}',
          success: false,
        },
        inputs: {
          trigger: {
            connections: [{ node: 758, output: 'trigger', data: { pins: [] } }],
          },
          images: {
            connections: [{ node: 758, output: 'images', data: { pins: [] } }],
          },
        },
        outputs: {
          trigger: {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
          image: {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-764.5575615198208, -302.86167492665004],
        name: 'Code',
      },
    },
  },
  createdAt: '2022-05-25T22:31:10.259Z',
  updatedAt: '2022-05-25T22:38:42.619Z',
  deletedAt: null,
  userId: '2508068',
  modules: [],
  gameState: {
    introText:
      'This is a simple AI generator app. Type anything and let the AI continue ',
  },
} as unknown as Spell

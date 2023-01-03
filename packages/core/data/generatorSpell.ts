import { Spell } from '../types'
export default {
  id: '3b7add2b-0f49-4c6b-8db9-18ecbb34602c',
  name: 'square amaranth',
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
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [{ node: 499, input: 'trigger', data: { pins: [] } }],
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
            'Continue the story from here:\nOnce there was a poor dude. He had nothing. He lived in a village in the country, and he spent his days working fishing nets. It was a shitty job, and he always got cold and wet. He never had any decent clothes and he could never afford a beer at',
          socketKey: 'ba6ed95b-3aac-49e9-91ae-a33f5510c83b',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            sendToPlaytest: { expanded: true },
          },
          sendToPlaytest: true,
        },
        inputs: {
          input: {
            connections: [
              { node: 499, output: 'composed', data: { pins: [] } },
            ],
          },
          trigger: {
            connections: [{ node: 499, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: { trigger: { connections: [] } },
        position: [-761.8236637217791, -374.13333794248774],
        name: 'Output',
      },
      '499': {
        id: 499,
        data: {
          stop: '\\n',
          temp: '0.8',
          error: false,
          inputs: [
            {
              name: 'input',
              taskType: 'output',
              socketKey: 'input',
              socketType: 'anySocket',
              connectionType: 'input',
            },
          ],
          fewshot: '{{input}}',
          maxTokens: 50,
          dataControls: {
            name: { expanded: true },
            stop: { expanded: true },
            temp: { expanded: true },
            inputs: { expanded: true },
            fewshot: { expanded: true },
            maxTokens: { expanded: true },
            frequencyPenalty: { expanded: true },
          },
        },
        inputs: {
          input: {
            connections: [{ node: 646, output: 'output', data: { pins: [] } }],
          },
          trigger: {
            connections: [{ node: 124, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: {
          trigger: {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
          result: { connections: [] },
          composed: {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-1145.130755699551, -375.2348763349078],
        name: 'Generator',
      },
      '646': {
        id: 646,
        data: {
          name: 'input',
          text: 'Input text here',
          socketKey: '3a9cfde5-32a0-4e96-9de7-7571a7a4e784',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            useDefault: { expanded: true },
            playtestToggle: { expanded: true },
          },
          playtestToggle: { receivePlaytest: true },
        },
        inputs: {},
        outputs: {
          output: {
            connections: [{ node: 499, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-1555.1553378286703, -376.7788066492969],
        name: 'Universal Input',
      },
    },
  },
  createdAt: '2022-05-25T22:31:10.259Z',
  updatedAt: '2022-05-25T22:31:41.984Z',
  deletedAt: null,
  userId: '2508068',
  modules: [],
  gameState: {
    introText:
      'This is a simple AI generator app. Type anything and let the AI continue ',
  },
} as unknown as Spell

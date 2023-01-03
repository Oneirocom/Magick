import { Spell } from '../types'

export default {
  id: '3e645657-ec88-43e7-9b4d-6c177219c8f2',
  name: 'genetic crimson',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      '124': {
        id: 124,
        data: {
          name: 'default',
          socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
          dataControls: { name: { expanded: true } },
          playtestToggle: { receivePlaytest: true },
          success: false,
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1555.4724883179474, -132.7648214211178],
        name: 'Module Trigger In',
      },
      '233': {
        id: 233,
        data: {
          name: 'output-233',
          socketKey: '5fc83754-ddf3-43fc-a7e2-992c5009f853',
          dataControls: {
            name: { expanded: true },
            sendToPlaytest: { expanded: true },
          },
          sendToPlaytest: true,
          display: 'stateOutput',
          success: false,
        },
        inputs: {
          input: {
            connections: [{ node: 776, output: 'output', data: { pins: [] } }],
          },
          trigger: {
            connections: [{ node: 124, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: { trigger: { connections: [] } },
        position: [-971.6674208065258, -230.93850108116374],
        name: 'Output',
      },
      '776': {
        id: 776,
        data: {
          dataControls: { outputs: { expanded: true } },
          outputs: [
            {
              name: 'output',
              taskType: 'output',
              socketKey: 'output',
              connectionType: 'output',
              socketType: 'anySocket',
            },
          ],
          success: false,
        },
        inputs: {},
        outputs: {
          output: {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-1349.40625, -385.50390625],
        name: 'State Read',
      },
    },
  },
  createdAt: '2022-06-09T15:41:18.512Z',
  updatedAt: '2022-06-08T03:42:12.331Z',
  deletedAt: null,
  userId: '2508068',
  modules: [],
  gameState: { output: 'stateOutput' },
} as unknown as Spell

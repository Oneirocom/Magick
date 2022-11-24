export const timeDetectorTest = {
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      111: {
        id: 111,
        data: {
          socketKey: 'a0c845e4-dfc9-46c0-a896-602988d42751',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'string',
        },
        inputs: {},
        outputs: {
          output: {
            connections: [],
          },
        },
        position: [-840.68408203125, -708.9649047851562],
        name: 'Module Input',
      },
      113: {
        id: 113,
        data: {
          socketKey: '637abbb4-b969-4133-87ac-03c50ffb44f5',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'moduleTrigger',
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [],
          },
        },
        position: [-838.649658203125, -824.8785400390625],
        name: 'Module Trigger In',
      },
      115: {
        id: 115,
        data: {
          socketKey: '996fc4c5-ebef-46c8-8245-34096acd5e06',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'moduleOutput',
        },
        inputs: {
          input: {
            connections: [],
          },
          trigger: {
            connections: [],
          },
        },
        outputs: {},
        position: [-47.934326171875, -718.2261962890625],
        name: 'Module Output',
      },
    },
  },
  gameState: {},
  createdAt: 1633703542664,
  updatedAt: 1633875346238,
  name: 'Time Detector Test',
  modules: [],
}

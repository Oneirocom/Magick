const graph = {
  id: 'demo@0.1.0',
  nodes: {
    '124': {
      id: 124,
      data: {
        name: 'default',
        socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
        dataControls: {
          name: {
            expanded: true,
          },
        },
      },
      inputs: {},
      outputs: {
        trigger: {
          connections: [],
        },
      },
      position: [-1555.4724883179474, -132.7648214211178],
      name: 'Module Trigger In',
    },
    '232': {
      id: 232,
      data: {
        playtestToggle: {
          receivePlaytest: false,
          outputs: [],
        },
        socketKey: '9d61118c-3c5a-4379-9dae-41965e56207f',
        text: 'Input text here',
        dataControls: {
          name: {
            expanded: true,
          },
          playtestToggle: {
            expanded: true,
          },
        },
        name: 'Input',
        outputs: [],
      },
      inputs: {},
      outputs: {
        output: {
          connections: [],
        },
      },
      position: [-1554.8394720686588, -362.87500885530955],
      name: 'Universal Input',
    },
    '233': {
      id: 233,
      data: {},
      inputs: {
        text: {
          connections: [],
        },
        trigger: {
          connections: [],
        },
      },
      outputs: {
        trigger: {
          connections: [],
        },
      },
      position: [-828.9994593860473, -299.2588216155752],
      name: 'Output',
    },
  },
}

export default graph

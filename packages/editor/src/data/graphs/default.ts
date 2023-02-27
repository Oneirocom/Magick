const graph = {
  id: 'demo@0.1.0',
  nodes: {
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
      position: [-200, 100],
      name: 'Input',
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
      position: [200, 0],
      name: 'Output',
    },
  },
}

export default graph

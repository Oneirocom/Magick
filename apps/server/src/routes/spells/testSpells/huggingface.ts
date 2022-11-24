export const huggingfaceTest = {
  name: 'Huggingface Test',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      78: {
        id: 78,
        data: {
          socketKey: '1c15de53-4c00-4ef7-a554-4c9dd7f3f487',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'trigger',
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [
              {
                node: 82,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-823.7835388183594, -464.546630859375],
        name: 'Module Trigger In',
      },
      79: {
        id: 79,
        data: {
          socketKey: '212bd2fd-a1fb-428c-ac81-1da928380106',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'prompt',
        },
        inputs: {},
        outputs: {
          output: {
            connections: [
              {
                node: 82,
                input: 'prompt',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-825.5476989746094, -317.13165283203125],
        name: 'Module Input',
      },
      81: {
        id: 81,
        data: {
          socketKey: 'bdab0eb0-11ad-49ac-9cea-06cf2d9fdcdf',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'Succesful Response',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 82,
                output: 'result',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 82,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [-88.110107421875, -388.2340087890625],
        name: 'Module Output',
      },
      82: {
        id: 82,
        data: {
          dataControls: {
            name: {
              expanded: true,
            },
            inputs: {
              expanded: true,
            },
            request: {
              expanded: true,
            },
            modelName: {
              expanded: true,
            },
          },
          modelName: 'gpt-2',
          inputs: [
            {
              name: 'prompt',
              taskType: 'output',
              socketKey: 'prompt',
              connectionType: 'input',
              socketType: 'anySocket',
            },
          ],
          request: '{{prompt}}',
          name: 'gpt-2',
        },
        inputs: {
          trigger: {
            connections: [
              {
                node: 78,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          prompt: {
            connections: [
              {
                node: 79,
                output: 'output',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {
          trigger: {
            connections: [
              {
                node: 81,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          result: {
            connections: [
              {
                node: 81,
                input: 'input',
                data: {
                  pins: [],
                },
              },
              {
                node: 83,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
          error: {
            connections: [
              {
                node: 83,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-471.49945068359375, -441.6856689453125],
        name: 'Huggingface',
      },
      83: {
        id: 83,
        data: {
          socketKey: '6b595627-d8dd-4fdb-9169-163b6f64a989',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'Error Response',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 82,
                output: 'result',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 82,
                output: 'error',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [-148.29296875, -218.14520263671875],
        name: 'Module Output',
      },
    },
  },
  gameState: {},
  createdAt: 1633728021053,
  updatedAt: 1633757799829,
  modules: [],
}

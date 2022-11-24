export const generatorTest = {
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
                node: 84,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-765.4136047363281, -467.7987060546875],
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
                node: 84,
                input: 'prompt',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-781.2272033691406, -336.2821044921875],
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
          name: 'Generator Result',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 84,
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
                node: 84,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [76.8306884765625, -475.30615234375],
        name: 'Module Output',
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
          name: 'Generator Composed Output',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 84,
                output: 'composed',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 84,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [86.4466552734375, -285.46502685546875],
        name: 'Module Output',
      },
      84: {
        id: 84,
        data: {
          dataControls: {
            name: {
              expanded: true,
            },
            inputs: {
              expanded: true,
            },
            fewshot: {
              expanded: true,
            },
            stop: {
              expanded: true,
            },
            temp: {
              expanded: true,
            },
            maxTokens: {
              expanded: true,
            },
          },
          temp: '0.5',
          inputs: [
            {
              name: 'prompt',
              taskType: 'output',
              socketKey: 'prompt',
              connectionType: 'input',
              socketType: 'anySocket',
            },
          ],
          stop: '/n',
          name: 'Generator Test',
          maxTokens: '256',
          fewshot: '{{prompt}}',
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
              {
                node: 83,
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
            ],
          },
          composed: {
            connections: [
              {
                node: 83,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-328.26108003224306, -405.9051534333118],
        name: 'Generator',
      },
    },
  },
  gameState: {},
  createdAt: 1633728021053,
  updatedAt: 1633762389299,
  name: 'Generator Test',
  modules: [],
}

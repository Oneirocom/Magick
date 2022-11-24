export const codeTest = {
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      21: {
        id: 21,
        data: {
          socketKey: 'df7ecf3e-a2f9-4637-a2df-f05d59523030',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'firstoutput',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 98,
                output: 'firstoutput',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 98,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [190.30209111975645, -463.73221599046417],
        name: 'Module Output',
      },
      39: {
        id: 39,
        data: {
          socketKey: '63ea44a8-74bd-47dc-97cc-d7439c21e5b2',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'secondOutput',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 98,
                output: 'secondoutput',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 98,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [185.09777715793285, -294.2486376852777],
        name: 'Module Output',
      },
      98: {
        id: 98,
        data: {
          code: '\n// See component information in inspector for details.\nfunction worker(node, inputs, data) {\n\n  // Keys of the object returned must match the names \n  // of your outputs you defined.\n\n  const firstInput = inputs["firstInput"][0]\n\n  const firstoutput = 1 + firstInput\n  const secondOutput = 2 + firstInput\n  return {\n    firstoutput,\n    secondOutput\n  }\n}\n',
          dataControls: {
            name: {
              expanded: true,
            },
            inputs: {
              expanded: false,
            },
            outputs: {
              expanded: true,
            },
            code: {
              expanded: true,
            },
          },
          outputs: [
            {
              name: 'first0utput',
              taskType: 'output',
              socketKey: 'firstoutput',
              connectionType: 'output',
              socketType: 'anySocket',
            },
            {
              name: 'secondOutput',
              taskType: 'output',
              socketKey: 'secondoutput',
              connectionType: 'output',
              socketType: 'anySocket',
            },
          ],
          inputs: [
            {
              name: 'firstInput',
              taskType: 'output',
              socketKey: 'firstinput',
              connectionType: 'input',
              socketType: 'anySocket',
            },
          ],
          name: 'Code Test',
        },
        inputs: {
          trigger: {
            connections: [
              {
                node: 99,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          firstinput: {
            connections: [
              {
                node: 100,
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
                node: 21,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
              {
                node: 39,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          firstoutput: {
            connections: [
              {
                node: 21,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
          secondoutput: {
            connections: [
              {
                node: 39,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-195.1627615258764, -400.79897016081986],
        name: 'Code',
      },
      99: {
        id: 99,
        data: {
          socketKey: 'e807838f-dbb2-49ac-b031-3547a1007815',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'Module Trigger',
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [
              {
                node: 98,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-569.8461463844735, -422.11008759733363],
        name: 'Module Trigger In',
      },
      100: {
        id: 100,
        data: {
          socketKey: 'd86f9ad0-00c4-4996-b374-71efdba66df9',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'firstInput',
        },
        inputs: {},
        outputs: {
          output: {
            connections: [
              {
                node: 98,
                input: 'firstinput',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-570.6368160807893, -296.9847073843718],
        name: 'Module Input',
      },
    },
  },
  gameState: {},
  createdAt: 1633703542664,
  updatedAt: 1633765292751,
  name: 'Code Component Test',
  modules: [],
}

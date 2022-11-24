export const switchGateTest = {
  name: 'Switch Gate Test',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      3: {
        id: 3,
        data: {
          socketKey: '22628386-aa18-40cd-8b6a-4e7c03fecb81',
          name: 'case',
          dataControls: {
            name: {
              expanded: true,
            },
          },
        },
        inputs: {},
        outputs: {
          output: {
            connections: [
              {
                node: 67,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-622.6674659855355, -483.7484979787559],
        name: 'Module Input',
      },
      4: {
        id: 4,
        data: {
          socketKey: '1a819a65-e1e2-4f77-9a42-9f99f546f7c4',
          name: 'trigger',
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [
              {
                node: 67,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-606.6003857673835, -619.0903126655428],
        name: 'Module Trigger In',
      },
      21: {
        id: 21,
        data: {
          socketKey: 'df7ecf3e-a2f9-4637-a2df-f05d59523030',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'resultOne',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 49,
                output: 'text',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 67,
                output: 'option one',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [21.098525865220324, -265.2013801510767],
        name: 'Module Output',
      },
      45: {
        id: 45,
        data: {
          socketKey: 'cdf5e66a-7f84-442c-9682-89c2b93f138a',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'resultTwo',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 52,
                output: 'text',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 67,
                output: 'option two',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [16.257959708028004, -118.22581450793004],
        name: 'Module Output',
      },
      49: {
        id: 49,
        data: {
          text: 'Switch component identified option one',
        },
        inputs: {},
        outputs: {
          text: {
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
        },
        position: [-619.4228628356076, -274.0385683276239],
        name: 'Input',
      },
      52: {
        id: 52,
        data: {
          text: 'Switch component identified option two',
        },
        inputs: {},
        outputs: {
          text: {
            connections: [
              {
                node: 45,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-623.5203729280256, -114.82537821705996],
        name: 'Input',
      },
      67: {
        id: 67,
        data: {
          dataControls: {
            outputs: {
              expanded: true,
            },
          },
          outputs: [
            {
              name: 'option one',
              taskType: 'option',
              socketKey: 'option one',
              connectionType: 'output',
              socketType: 'triggerSocket',
            },
            {
              name: 'option two',
              taskType: 'option',
              socketKey: 'option two',
              connectionType: 'output',
              socketType: 'triggerSocket',
            },
          ],
        },
        inputs: {
          input: {
            connections: [
              {
                node: 3,
                output: 'output',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 4,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {
          default: {
            connections: [],
          },
          optionOne: {
            connections: [
              {
                node: 21,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          optionTwo: {
            connections: [
              {
                node: 45,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-156.2683715878353, -532.2053210480004],
        name: 'Switch',
      },
    },
  },
  gameState: {},
  createdAt: 1633707484091,
  updatedAt: 1633726863032,
  modules: [],
}

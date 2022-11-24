export const safetyVerifierTest = {
  name: 'Safety Verifier Test',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      3: {
        id: 3,
        data: {
          socketKey: '22628386-aa18-40cd-8b6a-4e7c03fecb81',
          name: 'action',
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
                node: 47,
                input: 'string',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-697.9662860565335, -432.6971950013772],
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
                node: 47,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-720.3358099039369, -596.7960354808793],
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
          name: 'safeResult',
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
                node: 48,
                output: 'true',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [156.1271111580856, -198.96949084098193],
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
          name: 'unsafeResult',
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
                node: 48,
                output: 'false',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [154.2756224622367, -46.83051108676217],
        name: 'Module Output',
      },
      47: {
        id: 47,
        data: {
          fewshot:
            "Rate the actions according to the following content categories\nX: Explicit sexual content, rape, cannibalism, incest\nM: Heavy violence, light sexual content, safe for adults\nT: Light violence, safe for teens.\nE: Safe for everyone\n\nAction: dodge and fire a silver arrow.\nRating: E\n\nAction: Kiss her chest\nRating: M\n\nAction: Cum in the pig's mouth\nRating: X\n\nAction: Lick the woman's pussy\nRating: X\n\nAction: Behead the peasant with your axe\nRating: M\n\nAction: pull out elon musks not a flamethrower to burn the dragon\nRating: T\n\nAction: melt gold in cave and cover dragon with the melted gold\nRating: T\n\nAction: Laughed you figured your sister and fucked your best friend.\nRating: X\n\nAction: pick up governor and toss him out the window like from the emperors groove, with him screaming SORRRY\nRating: T\n\nAction: Rub the woman's genitals\nRating: X\n\nAction: Stroke the persons boobs\nRating: X\n\nAction: Pick up the bartender\nRating: T\n\nAction: Ask the guard why he's here.\nRating: E\n\nAction: Release the biggest load in the universe\nRating: X\n\nAction: Cast a spell to summon a fireball\nRating: T\n\nAction: Have sex with her\nRating: X\n\nAction: Take out my flamethrower\nRating: T\n\nAction: Slice off the bandit's head\nRating: M\n\nAction: Jerk off\nRating: X\n\nAction: ",
        },
        inputs: {
          string: {
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
          boolean: {
            connections: [
              {
                node: 48,
                input: 'boolean',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 48,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-339.4824346355768, -598.4872628456561],
        name: 'Safety Verifier',
      },
      48: {
        id: 48,
        data: {},
        inputs: {
          boolean: {
            connections: [
              {
                node: 47,
                output: 'boolean',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 47,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {
          trueTrue: {
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
          falseFalse: {
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
        position: [-649.1743719701242, -213.94146907530003],
        name: 'Boolean Gate',
      },
      49: {
        id: 49,
        data: {
          text: 'Boolean Gate Returned True for the Safety Verification Test',
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
        position: [-554.0752571100936, -45.870668418467034],
        name: 'Input',
      },
      52: {
        id: 52,
        data: {
          text: 'Boolean Gate Returned False for the Safety Verification TestInput text here',
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
        position: [-544.7980243568179, 120.77812977283952],
        name: 'Input',
      },
    },
  },
  gameState: {},
  createdAt: 1633707484091,
  updatedAt: 1633721257806,
  modules: [],
}

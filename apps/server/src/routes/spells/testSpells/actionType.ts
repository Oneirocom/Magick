export const actionTypeTest = {
  name: 'Action Type Classifier Test',
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
                node: 28,
                input: 'action',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-705.6770417976608, -209.41743475707628],
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
                node: 28,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-703.6864534694615, -338.11887296523986],
        name: 'Module Trigger In',
      },
      20: {
        id: 20,
        data: {
          socketKey: 'a48cfd41-46c6-4c59-8292-45483dfbfa3b',
        },
        inputs: {
          trigger: {
            connections: [
              {
                node: 28,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [156.14996337890625, -321.1500244140625],
        name: 'Module Trigger Out',
      },
      21: {
        id: 21,
        data: {
          socketKey: 'df7ecf3e-a2f9-4637-a2df-f05d59523030',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 28,
                output: 'actionType',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 28,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [154.16241455078125, -196.77505493164062],
        name: 'Module Output',
      },
      28: {
        id: 28,
        data: {
          fewshot:
            'Given an action classify the type of action it is\n\nTypes: look, get, use, craft, dialog, movement, travel, combat, consume, other\n\nAction, Type: pick up the bucket, get\nAction, Type: cast a fireball spell on the goblin, combat\nAction, Type: convince the king to give you his kingdom, dialog\nAction, Type: talk to the merchant, dialog\nAction, Type: leap over the chasm, movement\nAction, Type: climb up the mountain, travel\nAction, Type: throw a stone at the goblin, combat\nAction, Type: run away from the orcs, movement\nAction, Type: ask the baker to give you a free loaf of bread, dialog\nAction, Type: go to the forest, travel\nAction, Type: grab a torch off the wall, get\nAction, Type: throw your sword at the table, use\nAction, Type: journey to the city, travel\nAction, Type: drink your potion, use\nAction, Type: ',
        },
        inputs: {
          action: {
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
          actionType: {
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
          trigger: {
            connections: [
              {
                node: 20,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
              {
                node: 21,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-280.3544921875, -294.7459716796875],
        name: 'Action Type Classifier',
      },
    },
  },
  gameState: {},
  createdAt: 1633699106547,
  updatedAt: 1633701323719,
  modules: [],
}

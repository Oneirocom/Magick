export const entityDetectorTest = {
  name: 'Entity Detector Test',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      104: {
        id: 104,
        data: {
          socketKey: 'fd66489f-c5fe-4852-b0ee-dbbb68651ccd',
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
                node: 106,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-518.1908389428411, -700.6737452988817],
        name: 'Module Trigger In',
      },
      105: {
        id: 105,
        data: {
          socketKey: 'c8251a8d-7cf8-424a-8a9c-501f3bcf416e',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'action',
        },
        inputs: {},
        outputs: {
          output: {
            connections: [
              {
                node: 106,
                input: 'action',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-516.4863041871465, -561.4494087955308],
        name: 'Module Input',
      },
      106: {
        id: 106,
        data: {
          fewshot:
            "Given an action, detect what entities the player is interacting with. Ignore entities that the player is just asking about.\n\nEntity types: food, person, creature, object, place, other, none\n\nAction: throw an anvil at the man\nEntities: anvil, man\nTypes: object (use), person (target)\n\nAction: cast a fireball spell\nEntities: none\nTypes: none\n\nAction: convince the king to give you his kingdom\nEntities: king, kingdom\nTypes: person (target), object (dialog)\n\nAction: talk to the merchant\nEntities: merchant\nTypes: person (target)\n\nAction: ask where the bandit leader is\nEntities: bandit leader\nTypes: person (dialog)\n\nAction: leap over the chasm\nEntities: chasm\nTypes: location (target)\n\nAction: climb up the mountain\nEntities: mountain\nTypes: location (target)\n\nAction: throw a stone at the goblin\nEntities: stone, goblin\nTypes: object (use), creature (target)\n\nAction: run away from the orcs\nEntities: orcs\nTypes: creature (target)\n\nAction: ask how that relates to the dragon\nEntities: none\nTypes: none\n\nAction: ask the baker to give you a free loaf of bread\nEntities: baker, loaf of bread\nTypes: person (target), food (dialog)\n\nAction: get the merchant to give you better prices\nEntities: merchant\nTypes: person (target)\n\nAction: keep hiking\nEntities: none\nTypes: none\n\nAction: convince the bartender to give you the deed to his tavern\nEntities: bartender, tavern deed\nTypes: person (target), object (dialog)\n\nAction: go to the woman's home\nEntities: woman's home\nTypes: location (target)\n\nAction: ask the man for some water\nEntities: man, water\nTypes: person (target), object (dialog)\n\nAction: Jump onto your horse\nEntities: horse\nTypes: creature (target)\n\nAction: invent a new spell\nEntities: none\nTypes: none\n\nAction: ask the bartender for a machine gun\nEntities: bartender, machine gun\nTypes: person (target), object (dialog)\n\nAction: ask why the dragon attacked\nEntities: dragon\nTypes: creature (dialog)\n\nAction: cast a torchlight spell\nEntities: none\nTypes: none\n\nAction: ask where Zolarius the wizard is\nEntities: Zolarius the wizard\nTypes: person (dialog)\n\nAction: throw a pie at the waitress\nEntities: pie, waitress\nTypes: food (use), person (target)\n\nAction: ask where the wizard is\nEntities: wizard\nTypes: person (dialog)\n\nAction: draw your sword and fights the wolves\nEntities: sword, wolves\nTypes: object (use), creature (target)\n\nAction: ",
        },
        inputs: {
          action: {
            connections: [
              {
                node: 105,
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
                node: 104,
                output: 'trigger',
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
                node: 108,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          entities: {
            connections: [
              {
                node: 107,
                input: 'list',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-108.93954503041961, -663.5801359732754],
        name: 'Entity Detector',
      },
      107: {
        id: 107,
        data: {
          separator: '',
        },
        inputs: {
          list: {
            connections: [
              {
                node: 106,
                output: 'entities',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {
          text: {
            connections: [
              {
                node: 108,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-312.68483939526766, -310.0190828654877],
        name: 'Join List',
      },
      108: {
        id: 108,
        data: {
          socketKey: '1d76b962-c4d1-45da-9b81-b19380933807',
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'output',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 107,
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
                node: 106,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [76.94644438837236, -256.920302403975],
        name: 'Module Output',
      },
    },
  },
  gameState: {},
  createdAt: 1633871210449,
  updatedAt: 1633871455584,
  modules: [],
}

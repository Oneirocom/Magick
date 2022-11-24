export const itemDetectorTest = {
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
            connections: [
              {
                node: 114,
                input: 'string',
                data: {
                  pins: [],
                },
              },
            ],
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
            connections: [
              {
                node: 114,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-838.649658203125, -824.8785400390625],
        name: 'Module Trigger In',
      },
      114: {
        id: 114,
        data: {
          fewshot:
            'Given an action, detect the item which is taken.\n\nAction, Item: pick up the goblet from the fountain, goblet\nAction, Item: grab the axe from the tree stump, axe\nAction, Item: lean down and grab the spear from the ground, spear\nAction, Item: gather the valerian plant from the forest, valerian plant\nAction, Item: get the necklace from the box, necklace\nAction, Item: ',
        },
        inputs: {
          string: {
            connections: [
              {
                node: 111,
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
                node: 113,
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
                node: 115,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          detectedItem: {
            connections: [
              {
                node: 115,
                input: 'input',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-432.4732666015625, -751.004150390625],
        name: 'Item Detector',
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
            connections: [
              {
                node: 114,
                output: 'detectedItem',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 114,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
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
  updatedAt: 1633874677931,
  name: 'Item Detector Test',
  modules: [],
}

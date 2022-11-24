export const difficultyDetectorTest = {
  name: 'Difficulty Detector Test',
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
                node: 36,
                input: 'action',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-701.8776033210983, -217.21754462035753],
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
                node: 36,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        position: [-703.6864534694615, -338.4289925941461],
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
                node: 36,
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
          dataControls: {
            name: {
              expanded: true,
            },
          },
          name: 'difficulty',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 36,
                output: 'difficulty',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 36,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [155.76104736328125, -198.23757934570312],
        name: 'Module Output',
      },
      36: {
        id: 36,
        data: {
          fewshot:
            'Given an action, predict how hard it would be for a normal human in a fantasy world and what type of stat it uses.\n\nStat Types: strength, dexterity, endurance, intelligence, charisma\n\nAction, Difficulty, Type: throw an anvil at the man, 8/20, strength\nAction, Difficulty, Type: cast a fireball spell, 6/20, intelligence\nAction, Difficulty, Type: I\'m confident that I can kill the dragon! 2/20, charisma\nAction, Difficulty, Type: convince the king to give you his kingdom, 13/20, charisma\nAction, Difficulty, Type: talk to the merchant, 1/20, charisma\nAction, Difficulty, Type: ask the man if you can jump on his back and ride him around, 11/20, charisma\nAction, Difficulty, Type: pick up the mountain, 20/20, strength\nAction, Difficulty, Type: enter the room and tell the governor that you\'ll slay the dragon, 4/20, charisma\nAction, Difficulty, Type: run away, 4/20, dexterity\nAction, Difficulty, Type: ask why the dragon has been attacking people, 2/20, charisma\nAction, Difficulty, Type: say something wise, 6/20, intelligence\nAction, Difficulty, Type: sees a massive dragon flying over head, 7/20, Luck\nAction, Difficulty, Type: attack the Dragon, 6/20, strength\nAction, Difficulty, Type: continue harder and harder, 6/20, endurance\nAction, Difficulty, Type: feel pity for the gnome, 1/20, charisma\nAction, Difficulty, Type: set up a small blanket and pour the dragon a drink, 2/20, dexterity\nAction, Difficulty, Type: says "wait are you leaving me?", 2/20, charisma\nAction, Difficulty, Type: leap over the chasm, 7/20, dexterity\nAction, Difficulty, Type: talk to the bartender who gives you a pile of gold, 11/20, Luck\nAction, Difficulty, Type: climb up the mountain, 6/20, endurance\nAction, Difficulty, Type: goes to talk to the king, 2/20, charisma\nAction, Difficulty, Type: ask who the evil demon king is, 2/20, charisma\nAction, Difficulty, Type: do a back flip, 6/20, dexterity\nAction, Difficulty, Type: ',
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
              {
                node: 45,
                input: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
          difficulty: {
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
          category: {
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
        position: [-274.08709716796875, -311.539794921875],
        name: 'Difficulty Detector',
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
          name: 'category',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 36,
                output: 'category',
                data: {
                  pins: [],
                },
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 36,
                output: 'trigger',
                data: {
                  pins: [],
                },
              },
            ],
          },
        },
        outputs: {},
        position: [153.62489040354674, -48.05979969796463],
        name: 'Module Output',
      },
    },
  },
  gameState: {},
  createdAt: 1633707484091,
  updatedAt: 1633709145421,
  modules: [],
}

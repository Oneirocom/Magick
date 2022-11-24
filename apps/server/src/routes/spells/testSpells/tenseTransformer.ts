export const tenseTransformerTest = {
  name: 'Tense Transformer Test',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      '2': {
        id: 2,
        data: {
          socketKey: '02c8ac4b-c7e5-45fc-9e6e-62680bd158e5',
          name: 'name',
        },
        inputs: {},
        outputs: {
          output: {
            connections: [
              {
                node: 5,
                input: 'name',
                data: {},
              },
            ],
          },
        },
        position: [-704.5584311572628, -73.13445406248034],
        name: 'Module Input',
      },
      '3': {
        id: 3,
        data: {
          socketKey: '22628386-aa18-40cd-8b6a-4e7c03fecb81',
          name: 'text',
        },
        inputs: {},
        outputs: {
          output: {
            connections: [
              {
                node: 5,
                input: 'text',
                data: {},
              },
            ],
          },
        },
        position: [-705.6770417976608, -207.50874335082628],
        name: 'Module Input',
      },
      '4': {
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
                node: 5,
                input: 'trigger',
                data: {},
              },
            ],
          },
        },
        position: [-703.6864534694615, -338.11887296523986],
        name: 'Module Trigger In',
      },
      '5': {
        id: 5,
        data: {
          fewshot:
            'Change each statement to be in the third person present tense and correct all grammar.\n\nMatt: am sleepy.\nThird Person: Matt is sleepy.\n---\nMatt: bllogha bloghs.\nThird Person: Matt makes nonsensical sounds.\n--\nJackson: tell the king that you won\'t help him.\nThird Person: Jackson tells the king that he won\'t help him.\n---\nJill: can I have a mug of ale?\nThird Person: Jill says, "Can I have a mug of ale?"\n---\nSam: say i\'d be happy to help you\nThird Person: Sam says, "I\'d be happy to help you."\n---\nCogsworth: draw my sword of light and slice myself in the forehead.\nThird Person: Cogsworth draws his sword of light and slices himself in the forehead.\n---\nJon: say but you said I could have it. Please?\nThird Person: Jon says, "But you said I could have it. Please?"\n---\nEliza: ask my friend where he\'s going\nThird Person: Eliza asks her friend where he\'s going.\n---\nAaron: am sleepy.\nThird Person: Aaron is sleepy.\n---\nRobert: say I think I can resist it if you give me potion of Mind Shield. Do u have one?\nThird Person: Robert says, "I think I can resist it if you give me a potion of Mind Shield. Do you have one?"\n---\nJack: go talk to the knight\nThird Person: Jack goes to talk to the knight\n---\nJack: say What are you doing?!\nThird Person: Jack says, "What are you doing?!"\n---\nJames: I\'m confident that I can kill the dragon!\nThird Person: James says, "I\'m confident that I can kill the dragon!"\n---\nErica: want to go to the store but trip over my own shoes.\nThird Person: Erica wants to go to the store but she trips over her own shoes.\n---\nTom: told her that it was over.\nThird Person: Tom told her that it was over.\n---\nFred: ask what time is it?\nThird Person: Fred asks, "What time is it?"\n---\nJames: okay!\nThird Person: James says, "Okay!"\n--\nFred: command the mercenaries to attack the dragon while you rescue the princess.\nThird Person: Fred commands the mercenaries to attack the dragon while he rescues the princess.\n---\n',
        },
        inputs: {
          trigger: {
            connections: [
              {
                node: 4,
                output: 'trigger',
                data: {},
              },
            ],
          },
          text: {
            connections: [
              {
                node: 3,
                output: 'output',
                data: {},
              },
            ],
          },
          name: {
            connections: [
              {
                node: 2,
                output: 'output',
                data: {},
              },
            ],
          },
        },
        outputs: {
          action: {
            connections: [
              {
                node: 21,
                input: 'input',
                data: {},
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 21,
                input: 'trigger',
                data: {},
              },
              {
                node: 20,
                input: 'trigger',
                data: {},
              },
            ],
          },
        },
        position: [-281.2092672559847, -302.30118353826043],
        name: 'Tense Transformer',
      },
      '20': {
        id: 20,
        data: {
          socketKey: 'a48cfd41-46c6-4c59-8292-45483dfbfa3b',
        },
        inputs: {
          trigger: {
            connections: [
              {
                node: 5,
                output: 'trigger',
                data: {},
              },
            ],
          },
        },
        outputs: {},
        position: [156.14996337890625, -321.1500244140625],
        name: 'Module Trigger Out',
      },
      '21': {
        id: 21,
        data: {
          socketKey: 'df7ecf3e-a2f9-4637-a2df-f05d59523030',
        },
        inputs: {
          input: {
            connections: [
              {
                node: 5,
                output: 'action',
                data: {},
              },
            ],
          },
          trigger: {
            connections: [
              {
                node: 5,
                output: 'trigger',
                data: {},
              },
            ],
          },
        },
        outputs: {},
        position: [154.16241455078125, -196.77505493164062],
        name: 'Module Output',
      },
    },
  },
  gameState: {},
  createdAt: 1633382439699,
  updatedAt: 1633382623421,
  modules: [
    {
      name: 'Crafting',
      id: 'dd4bc920-2542-44fe-a588-41051e7b09b3',
      data: {
        id: 'demo@0.1.0',
        nodes: {
          '26': {
            id: 26,
            data: {
              socketKey: '603e2acd-f17f-4070-b0f1-d93b733048bd',
              dataControls: {
                name: {
                  expanded: true,
                },
              },
              name: 'input',
            },
            inputs: {},
            outputs: {
              output: {
                connections: [
                  {
                    node: 28,
                    input: 'input1',
                    data: {
                      pins: [],
                    },
                  },
                ],
              },
            },
            position: [-749.5798034667969, -347.4363742696649],
            name: 'Module Input',
          },
          '27': {
            id: 27,
            data: {
              socketKey: 'e5ab2f18-b9c0-4214-b0a6-eb48fbc67610',
              dataControls: {
                name: {
                  expanded: true,
                },
              },
              name: 'triggerin',
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
            position: [-741.9115600585938, -211.123779296875],
            name: 'Module Trigger In',
          },
          '28': {
            id: 28,
            data: {
              dataControls: {
                'throughputs-28': {
                  expanded: true,
                },
              },
              'throughputs-28': {
                inputs: [
                  {
                    name: 'Trigger',
                    socketKey: 'trigger',
                    socketType: 'triggerSocket',
                    taskType: 'option',
                  },
                  {
                    name: 'input1',
                    socketKey: 'input1',
                    socketType: 'stringSocket',
                    taskType: 'output',
                  },
                ],
                outputs: [
                  {
                    name: 'Trigger',
                    socketKey: 'trigger',
                    socketType: 'triggerSocket',
                    taskType: 'option',
                  },
                  {
                    name: 'output1',
                    socketKey: 'output1',
                    socketType: 'stringSocket',
                    taskType: 'output',
                  },
                ],
                activeTask: {
                  taskName: 'Crafting',
                  task: {
                    id: '235',
                    name: 'Crafting',
                    numInputs: 1,
                    numOutputs: 1,
                    unstuffedParentId: null,
                    createdAt: '2021-06-01T19:28:42.932Z',
                    updatedAt: '2021-06-01T19:28:42.932Z',
                    deletedAt: null,
                  },
                  data: [
                    {
                      id: '395',
                      fewshotTaskId: '235',
                      inputs: ['trap'],
                      outputs: ['wood(3), lashing(2)'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:43.509Z',
                      updatedAt: '2021-06-01T19:28:43.509Z',
                      deletedAt: null,
                    },
                    {
                      id: '402',
                      fewshotTaskId: '235',
                      inputs: ['wooden spear'],
                      outputs: ['wood(3)'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:44.893Z',
                      updatedAt: '2021-06-01T19:28:44.893Z',
                      deletedAt: null,
                    },
                    {
                      id: '396',
                      fewshotTaskId: '235',
                      inputs: ['shelter'],
                      outputs: ['wood(4), lashing(2)\n'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:43.682Z',
                      updatedAt: '2021-06-01T19:28:43.682Z',
                      deletedAt: null,
                    },
                    {
                      id: '403',
                      fewshotTaskId: '235',
                      inputs: ['trap'],
                      outputs: ['wood(3), lashing(2)'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:44.905Z',
                      updatedAt: '2021-06-01T19:28:44.905Z',
                      deletedAt: null,
                    },
                    {
                      id: '414',
                      fewshotTaskId: '235',
                      inputs: ['shotgun'],
                      outputs: [
                        'shotgun barrel(1), shotgun parts(3), ammo(20)',
                      ],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:29:52.843Z',
                      updatedAt: '2021-06-01T19:29:52.843Z',
                      deletedAt: null,
                    },
                    {
                      id: '397',
                      fewshotTaskId: '235',
                      inputs: ['plane parts'],
                      outputs: ['uncraftable'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:43.685Z',
                      updatedAt: '2021-06-01T19:28:43.685Z',
                      deletedAt: null,
                    },
                    {
                      id: '404',
                      fewshotTaskId: '235',
                      inputs: ['plane parts'],
                      outputs: ['uncraftable'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:44.915Z',
                      updatedAt: '2021-06-01T19:28:44.915Z',
                      deletedAt: null,
                    },
                    {
                      id: '398',
                      fewshotTaskId: '235',
                      inputs: ['jeep'],
                      outputs: ['jeep frame(1), jeep parts(3), fuel(20)\n'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:43.946Z',
                      updatedAt: '2021-06-01T19:28:43.946Z',
                      deletedAt: null,
                    },
                    {
                      id: '410',
                      fewshotTaskId: '235',
                      inputs: ['jeep'],
                      outputs: ['jeep frame(1), jeep parts(3), fuel(20)\n'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:28:45.197Z',
                      updatedAt: '2021-06-01T19:28:45.197Z',
                      deletedAt: null,
                    },
                    {
                      id: '412',
                      fewshotTaskId: '235',
                      inputs: ['cloth dress'],
                      outputs: ['cloth(3)'],
                      creator: '23505660',
                      provenance: null,
                      tags: null,
                      createdAt: '2021-06-01T19:29:52.804Z',
                      updatedAt: '2021-06-01T19:29:52.804Z',
                      deletedAt: null,
                    },
                  ],
                  serialization: {
                    id: '169',
                    fewshotTaskId: '235',
                    name: 'default',
                    isPreferred: true,
                    introduction:
                      'Given an item decide what it takes to craft it\n\n',
                    beforeEachInput: ['Item: '],
                    inBetween: '\nRequired: ',
                    beforeEachOutput: [''],
                    atTheEnd: '\n\nNEXT\n\n',
                    createdAt: '2021-06-01T19:28:43.359Z',
                    updatedAt: '2021-06-01T19:29:31.094Z',
                    deletedAt: null,
                  },
                },
              },
              outputs: [
                {
                  name: 'Trigger',
                  socketKey: 'trigger',
                  socketType: 'triggerSocket',
                  taskType: 'option',
                },
                {
                  name: 'output1',
                  socketKey: 'output1',
                  socketType: 'stringSocket',
                  taskType: 'output',
                },
              ],
              inputs: [
                {
                  name: 'Trigger',
                  socketKey: 'trigger',
                  socketType: 'triggerSocket',
                  taskType: 'option',
                },
                {
                  name: 'input1',
                  socketKey: 'input1',
                  socketType: 'stringSocket',
                  taskType: 'output',
                },
              ],
              name: 'Crafting',
              activetask: {
                taskName: 'Crafting',
                task: {
                  id: '235',
                  name: 'Crafting',
                  numInputs: 1,
                  numOutputs: 1,
                  unstuffedParentId: null,
                  createdAt: '2021-06-01T19:28:42.932Z',
                  updatedAt: '2021-06-01T19:28:42.932Z',
                  deletedAt: null,
                },
                data: [
                  {
                    id: '395',
                    fewshotTaskId: '235',
                    inputs: ['trap'],
                    outputs: ['wood(3), lashing(2)'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:43.509Z',
                    updatedAt: '2021-06-01T19:28:43.509Z',
                    deletedAt: null,
                  },
                  {
                    id: '402',
                    fewshotTaskId: '235',
                    inputs: ['wooden spear'],
                    outputs: ['wood(3)'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:44.893Z',
                    updatedAt: '2021-06-01T19:28:44.893Z',
                    deletedAt: null,
                  },
                  {
                    id: '396',
                    fewshotTaskId: '235',
                    inputs: ['shelter'],
                    outputs: ['wood(4), lashing(2)\n'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:43.682Z',
                    updatedAt: '2021-06-01T19:28:43.682Z',
                    deletedAt: null,
                  },
                  {
                    id: '403',
                    fewshotTaskId: '235',
                    inputs: ['trap'],
                    outputs: ['wood(3), lashing(2)'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:44.905Z',
                    updatedAt: '2021-06-01T19:28:44.905Z',
                    deletedAt: null,
                  },
                  {
                    id: '414',
                    fewshotTaskId: '235',
                    inputs: ['shotgun'],
                    outputs: ['shotgun barrel(1), shotgun parts(3), ammo(20)'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:29:52.843Z',
                    updatedAt: '2021-06-01T19:29:52.843Z',
                    deletedAt: null,
                  },
                  {
                    id: '397',
                    fewshotTaskId: '235',
                    inputs: ['plane parts'],
                    outputs: ['uncraftable'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:43.685Z',
                    updatedAt: '2021-06-01T19:28:43.685Z',
                    deletedAt: null,
                  },
                  {
                    id: '404',
                    fewshotTaskId: '235',
                    inputs: ['plane parts'],
                    outputs: ['uncraftable'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:44.915Z',
                    updatedAt: '2021-06-01T19:28:44.915Z',
                    deletedAt: null,
                  },
                  {
                    id: '398',
                    fewshotTaskId: '235',
                    inputs: ['jeep'],
                    outputs: ['jeep frame(1), jeep parts(3), fuel(20)\n'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:43.946Z',
                    updatedAt: '2021-06-01T19:28:43.946Z',
                    deletedAt: null,
                  },
                  {
                    id: '410',
                    fewshotTaskId: '235',
                    inputs: ['jeep'],
                    outputs: ['jeep frame(1), jeep parts(3), fuel(20)\n'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:28:45.197Z',
                    updatedAt: '2021-06-01T19:28:45.197Z',
                    deletedAt: null,
                  },
                  {
                    id: '412',
                    fewshotTaskId: '235',
                    inputs: ['cloth dress'],
                    outputs: ['cloth(3)'],
                    creator: '23505660',
                    provenance: null,
                    tags: null,
                    createdAt: '2021-06-01T19:29:52.804Z',
                    updatedAt: '2021-06-01T19:29:52.804Z',
                    deletedAt: null,
                  },
                ],
                serialization: {
                  id: '169',
                  fewshotTaskId: '235',
                  name: 'default',
                  isPreferred: true,
                  introduction:
                    'Given an item decide what it takes to craft it\n\n',
                  beforeEachInput: ['Item: '],
                  inBetween: '\nRequired: ',
                  beforeEachOutput: [''],
                  atTheEnd: '\n\nNEXT\n\n',
                  createdAt: '2021-06-01T19:28:43.359Z',
                  updatedAt: '2021-06-01T19:29:31.094Z',
                  deletedAt: null,
                },
              },
            },
            inputs: {
              trigger: {
                connections: [
                  {
                    node: 27,
                    output: 'trigger',
                    data: {
                      pins: [],
                    },
                  },
                ],
              },
              input1: {
                connections: [
                  {
                    node: 26,
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
                    node: 29,
                    input: 'trigger',
                    data: {
                      pins: [],
                    },
                  },
                  {
                    node: 30,
                    input: 'trigger',
                    data: {
                      pins: [],
                    },
                  },
                ],
              },
              output1: {
                connections: [
                  {
                    node: 30,
                    input: 'input',
                    data: {
                      pins: [],
                    },
                  },
                ],
              },
            },
            position: [-339.24756339127873, -289.64520528432854],
            name: 'Enki Task',
          },
          '29': {
            id: 29,
            data: {
              socketKey: '89612758-265e-42a6-b832-8ba4f23fc0be',
              dataControls: {
                name: {
                  expanded: true,
                },
              },
              name: 'triggerout',
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
            position: [33.62321997867616, -326.2289051387818],
            name: 'Module Trigger Out',
          },
          '30': {
            id: 30,
            data: {
              socketKey: '31a26230-229f-46aa-ba50-002a55d04079',
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
                    node: 28,
                    output: 'output1',
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
            position: [16.76892539966276, -191.8822412449624],
            name: 'Module Output',
          },
        },
      },
    },
  ],
}

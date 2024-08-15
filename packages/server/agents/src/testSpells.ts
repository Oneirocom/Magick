import { SpellInterface } from '@magickml/agent-server-schemas'

export const testSpell1 = {
  id: '1ac9b686-ea6b-463a-a221-2e5d1466406b',
  name: 'first-spell',
  projectId: 'clzd9ymf30001dvsxf9r08exv',
  createdAt: '2024-08-13T18:50:04.541Z',
  updatedAt: '1723575164458',
  type: 'behave',
  spellReleaseId: null,
  worldId: null,
  graph: {
    nodes: [
      {
        id: 'c6b8cf7a-c429-4f88-9024-56af101b8d55',
        type: 'logic/string',
        metadata: {
          positionX: '-77.20632108991845',
          positionY: '587.1242318540455',
        },
        parameters: {
          a: {
            value: "always respond with 'Hello World'",
          },
        },
        configuration: {},
      },
      {
        id: 'aba2a6b6-d7fc-416b-a10d-1f0a5f308d4e',
        type: 'magick/sendMessage',
        metadata: {
          positionX: '594.6266462433362',
          positionY: '358.9089114014927',
        },
        parameters: {
          content: {
            link: {
              nodeId: '780a68dd-aff9-4a64-bb2f-38e2e600f5d9',
              socket: 'response',
            },
          },
        },
        configuration: {},
      },
      {
        id: '780a68dd-aff9-4a64-bb2f-38e2e600f5d9',
        type: 'magick/generateText',
        flows: {
          done: {
            nodeId: 'aba2a6b6-d7fc-416b-a10d-1f0a5f308d4e',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '254.4532035359356',
          positionY: '360.2907561197659',
        },
        parameters: {
          prompt: {
            link: {
              nodeId: 'd43f20b9-14f1-4ea4-ae4d-6ce788c004df',
              socket: 'content',
            },
          },
          system: {
            link: {
              nodeId: 'c6b8cf7a-c429-4f88-9024-56af101b8d55',
              socket: 'result',
            },
          },
        },
        configuration: {
          model: 'gpt-3.5-turbo',
          models: [],
          customBaseUrl: '',
          modelProvider: 'openai',
          modelProviders: [],
          hiddenProperties: [
            'hiddenProperties',
            'modelProvider',
            'model',
            'models',
            'customBaseUrl',
            'providerApiKeyName',
          ],
          providerApiKeyName: 'OPENAI_API_KEY',
        },
      },
      {
        id: 'd43f20b9-14f1-4ea4-ae4d-6ce788c004df',
        type: 'magick/onMessage',
        flows: {
          flow: {
            nodeId: '780a68dd-aff9-4a64-bb2f-38e2e600f5d9',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '-75.44987775747575',
          positionY: '360.1453780598829',
        },
        configuration: {
          eventState: [],
          hiddenProperties: ['hiddenProperties', 'eventState'],
          eventStateProperties: [
            'connector',
            'client',
            'channel',
            'agentId',
            'sender',
          ],
        },
      },
    ],
    variables: [],
    graphInputs: [],
    customEvents: [],
    graphOutputs: [],
  },
} as SpellInterface

export const testSpell2 = {
  id: 'ec31e2f4-c96e-4648-8561-3c36930a4f03',
  name: 'document pipeline-copy-copy',
  projectId: 'clzd9ymf30001dvsxf9r08exv',
  createdAt: '2024-08-14T22:02:05.553Z',
  updatedAt: '1723762639219',
  type: 'behave',
  spellReleaseId: null,
  worldId: null,
  graph: {
    data: {
      comments: [
        {
          id: '47c5a3d8-f471-4f13-a0c0-b44c03af5959',
          text: 'Now you can do something to the chunks for processing.  Probably want to accumulate them with this for each loop into a variable and summarize them\n',
          width: 293,
          height: 166,
          metadata: {
            positionX: '2046.7045702396858',
            positionY: '89.42172395928037',
          },
        },
      ],
    },
    nodes: [
      {
        id: '59a32bf5-906b-411d-ae30-51aac167097b',
        type: 'magick/sendMessage',
        metadata: {
          positionX: '2055.315029026098',
          positionY: '336.2385948430691',
        },
        parameters: {
          content: {
            value: 'done',
          },
        },
        configuration: {},
      },
      {
        id: '3335cfc6-ce39-4ad9-b8ff-120847159400',
        type: 'variables/set',
        metadata: {
          positionX: '-427.5158277533699',
          positionY: '323.5246990138604',
        },
        configuration: {
          emitEvent: true,
          variableId: '35b79395-7fd3-4027-a753-67b9ae089792',
          socketInputs: [
            {
              name: 'currentPackId',
              valueType: 'string',
            },
          ],
          socketOutputs: [
            {
              name: 'currentPackId',
              valueType: 'string',
            },
          ],
          valueTypeName: 'string',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'socketInputs',
            'label',
            'valueTypeName',
          ],
        },
      },
      {
        id: '60cc004a-9fa9-4fee-b157-9f6f95c18514',
        type: 'knowledge/embedder/addWebSource',
        flows: {
          flow: {
            nodeId: 'fbdbdd92-9f46-46eb-893f-4afe191a1bbc',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '803.5059357363095',
          positionY: '177.96254376614655',
        },
        parameters: {
          name: {
            value: 'test',
          },
          packId: {
            link: {
              nodeId: '164f785a-4b17-4ac8-8bc7-8fe6bfd07e6b',
              socket: 'currentPackId',
            },
          },
          urlOrContent: {
            link: {
              nodeId: 'f5dedea6-23c0-437a-a926-de1ea2447afd',
              socket: 'url',
            },
          },
        },
        configuration: {
          packId: '',
          hiddenProperties: ['packId'],
        },
      },
      {
        id: '57f3bc2c-be5d-47ad-bb4c-2ddf571f44c8',
        type: 'flow/array/forEach',
        flows: {
          completed: {
            nodeId: '59a32bf5-906b-411d-ae30-51aac167097b',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '1752.9261209891597',
          positionY: '90.5379989873581',
        },
        parameters: {
          array: {
            link: {
              nodeId: '468c7c64-38c7-4b6f-bdd8-2fc6ae31bb35',
              socket: 'chunks',
            },
          },
        },
        configuration: {
          valueType: 'string',
          socketOutputs: [
            {
              key: 'Array Item',
              name: 'Array Item',
              valueType: 'string',
            },
          ],
          hiddenProperties: [
            'hiddenProperties',
            'valueTypes',
            'socketInputs',
            'socketOutputs',
            'valueTypeOptions',
          ],
          valueTypeOptions: {
            values: ['string', 'number', 'float', 'boolean', 'object', 'array'],
            socketName: 'Array Item',
          },
        },
      },
      {
        id: 'f5dedea6-23c0-437a-a926-de1ea2447afd',
        type: 'variables/get',
        metadata: {
          positionX: '487.21211379461283',
          positionY: '567.4299880143885',
        },
        configuration: {
          variableId: '7184dbac-8449-4253-8c11-d076cbe58d24',
          socketOutputs: [
            {
              name: 'url',
              valueType: 'string',
            },
          ],
          valueTypeName: 'string',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'label',
            'valueTypeName',
          ],
        },
      },
      {
        id: '47a0f167-3bf0-4e6f-afff-65c4b084c620',
        type: 'variables/on',
        flows: {
          flow: {
            nodeId: 'fbdbdd92-9f46-46eb-893f-4afe191a1bbc',
            socket: 'cancel',
          },
        },
        metadata: {
          positionX: '828.39692424945',
          positionY: '-2.117224054366261',
        },
        configuration: {
          eventState: [],
          variableId: '2bdde20e-6163-494f-a430-e9483390d315',
          socketOutputs: [
            {
              name: 'reset',
              valueType: 'boolean',
            },
            {
              name: 'lastValue',
              valueType: 'boolean',
            },
          ],
          valueTypeName: 'boolean',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'eventState',
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'label',
            'valueTypeName',
          ],
          eventStateProperties: [
            'connector',
            'client',
            'channel',
            'agentId',
            'sender',
          ],
        },
      },
      {
        id: '390ce233-5cbb-4722-bb6e-3d0c4d4231ba',
        type: 'variables/set',
        flows: {
          flow: {
            nodeId: '3335cfc6-ce39-4ad9-b8ff-120847159400',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '-712.6280841010455',
          positionY: '318.24276530220493',
        },
        configuration: {
          emitEvent: true,
          variableId: '2bdde20e-6163-494f-a430-e9483390d315',
          socketInputs: [
            {
              name: 'reset',
              valueType: 'boolean',
            },
          ],
          socketOutputs: [
            {
              name: 'reset',
              valueType: 'boolean',
            },
          ],
          valueTypeName: 'boolean',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'socketInputs',
            'label',
            'valueTypeName',
          ],
        },
      },
      {
        id: 'e8bee37f-5d4f-42ed-bf66-4765dddb694b',
        type: 'variables/set',
        flows: {
          flow: {
            nodeId: '09ef100a-5023-40f2-b5aa-9022a910032f',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '-707.1341793366598',
          positionY: '134.45635347720577',
        },
        parameters: {
          url: {
            value: 'https://www.magickml.com/',
          },
        },
        configuration: {
          emitEvent: true,
          variableId: '7184dbac-8449-4253-8c11-d076cbe58d24',
          socketInputs: [
            {
              name: 'url',
              valueType: 'string',
            },
          ],
          socketOutputs: [
            {
              name: 'url',
              valueType: 'string',
            },
          ],
          valueTypeName: 'string',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'socketInputs',
            'label',
            'valueTypeName',
          ],
        },
      },
      {
        id: '164f785a-4b17-4ac8-8bc7-8fe6bfd07e6b',
        type: 'variables/get',
        metadata: {
          positionX: '492.3470056568815',
          positionY: '463.6686609818139',
        },
        configuration: {
          variableId: '35b79395-7fd3-4027-a753-67b9ae089792',
          socketOutputs: [
            {
              name: 'currentPackId',
              valueType: 'string',
            },
          ],
          valueTypeName: 'string',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'label',
            'valueTypeName',
          ],
        },
      },
      {
        id: '7e585026-34cf-4e13-9da9-598d8af2935d',
        type: 'variables/set',
        flows: {
          flow: {
            nodeId: '60cc004a-9fa9-4fee-b157-9f6f95c18514',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '491.31651768983875',
          positionY: '255.00267764223605',
        },
        parameters: {
          currentPackId: {
            link: {
              nodeId: '5ed75eab-44b0-4728-85cb-efc3ca6f300a',
              socket: 'id',
            },
          },
        },
        configuration: {
          emitEvent: true,
          variableId: '35b79395-7fd3-4027-a753-67b9ae089792',
          socketInputs: [
            {
              name: 'currentPackId',
              valueType: 'string',
            },
          ],
          socketOutputs: [
            {
              name: 'currentPackId',
              valueType: 'string',
            },
          ],
          valueTypeName: 'string',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'socketInputs',
            'label',
            'valueTypeName',
          ],
        },
      },
      {
        id: '9713de3f-4e57-4e4b-b531-410a53da6f91',
        type: 'variables/get',
        metadata: {
          positionX: '-697.022052582319',
          positionY: '685.2101996420386',
        },
        configuration: {
          variableId: '35b79395-7fd3-4027-a753-67b9ae089792',
          socketOutputs: [
            {
              name: 'currentPackId',
              valueType: 'string',
            },
          ],
          valueTypeName: 'string',
          variableNames: [],
          hiddenProperties: [
            'hiddenProperties',
            'variableId',
            'socketOutputs',
            'label',
            'valueTypeName',
          ],
        },
      },
      {
        id: '7297ed3d-95b4-47d9-9638-5d4871eb9d27',
        type: 'logic/string/isDefined',
        metadata: {
          positionX: '-420.16604373487473',
          positionY: '660.2431868061982',
        },
        parameters: {
          a: {
            link: {
              nodeId: '9713de3f-4e57-4e4b-b531-410a53da6f91',
              socket: 'currentPackId',
            },
          },
        },
        configuration: {},
      },
      {
        id: '09ef100a-5023-40f2-b5aa-9022a910032f',
        type: 'flow/branch',
        flows: {
          true: {
            nodeId: '60cc004a-9fa9-4fee-b157-9f6f95c18514',
            socket: 'flow',
          },
          false: {
            nodeId: '5ed75eab-44b0-4728-85cb-efc3ca6f300a',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '-141.1266647916841',
          positionY: '140.77347454224184',
        },
        parameters: {
          condition: {
            link: {
              nodeId: '7297ed3d-95b4-47d9-9638-5d4871eb9d27',
              socket: 'result',
            },
          },
        },
        configuration: {},
      },
      {
        id: 'fbdbdd92-9f46-46eb-893f-4afe191a1bbc',
        type: 'knowledge/embedder/awaitLoader',
        flows: {
          completed: {
            nodeId: '468c7c64-38c7-4b6f-bdd8-2fc6ae31bb35',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '1138.9248484580003',
          positionY: '183.75153968020305',
        },
        parameters: {
          packId: {
            link: {
              nodeId: '164f785a-4b17-4ac8-8bc7-8fe6bfd07e6b',
              socket: 'currentPackId',
            },
          },
          loaderId: {
            link: {
              nodeId: '60cc004a-9fa9-4fee-b157-9f6f95c18514',
              socket: 'loaderId',
            },
          },
        },
        configuration: {
          checkIntervalMs: 500,
        },
      },
      {
        id: '5ca5c76f-bb39-4e9f-a20c-63f2a0bcd7ad',
        type: 'flow/switch',
        flows: {
          '/reset': {
            nodeId: '390ce233-5cbb-4722-bb6e-3d0c4d4231ba',
            socket: 'flow',
          },
          default: {
            nodeId: 'e8bee37f-5d4f-42ed-bf66-4765dddb694b',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '-1003.0461135053133',
          positionY: '207.29297698234902',
        },
        parameters: {
          string: {
            link: {
              nodeId: 'd7948ce9-43a4-4f79-a505-0d745b7dbabc',
              socket: 'content',
            },
          },
        },
        configuration: {
          socketValues: ['flow'],
          socketOutputs: [
            {
              name: '/reset',
              valueType: 'flow',
            },
          ],
          hiddenProperties: [
            'hiddenProperties',
            'textEditorOptions',
            'textEditorData',
            'socketValues',
          ],
        },
      },
      {
        id: '5ed75eab-44b0-4728-85cb-efc3ca6f300a',
        type: 'knowledge/embedder/createKnowledgePack',
        flows: {
          flow: {
            nodeId: '7e585026-34cf-4e13-9da9-598d8af2935d',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '186.34705693905448',
          positionY: '256.7047570293545',
        },
        parameters: {
          name: {
            value: 'default',
          },
          description: {
            value: 'test',
          },
        },
        configuration: {},
      },
      {
        id: '468c7c64-38c7-4b6f-bdd8-2fc6ae31bb35',
        type: 'knowledge/embedder/getChunks',
        flows: {
          flow: {
            nodeId: '57f3bc2c-be5d-47ad-bb4c-2ddf571f44c8',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '1434.497692969605',
          positionY: '155.91622533218916',
        },
        parameters: {
          packId: {
            link: {
              nodeId: '164f785a-4b17-4ac8-8bc7-8fe6bfd07e6b',
              socket: 'currentPackId',
            },
          },
          loaderId: {
            link: {
              nodeId: '60cc004a-9fa9-4fee-b157-9f6f95c18514',
              socket: 'loaderId',
            },
          },
        },
        configuration: {
          packId: '',
          loaderId: '',
          hiddenProperties: ['packId', 'loaderId'],
        },
      },
      {
        id: 'd7948ce9-43a4-4f79-a505-0d745b7dbabc',
        type: 'magick/onMessage',
        flows: {
          flow: {
            nodeId: '5ca5c76f-bb39-4e9f-a20c-63f2a0bcd7ad',
            socket: 'flow',
          },
        },
        metadata: {
          positionX: '-1367.136002643141',
          positionY: '210.5223104888566',
        },
        configuration: {
          eventState: [],
          hiddenProperties: ['hiddenProperties', 'eventState'],
          eventStateProperties: [
            'connector',
            'client',
            'channel',
            'agentId',
            'sender',
          ],
        },
      },
    ],
    variables: [
      {
        id: '35b79395-7fd3-4027-a753-67b9ae089792',
        name: 'currentPackId',
        initialValue: '',
        valueTypeName: 'string',
      },
      {
        id: '7184dbac-8449-4253-8c11-d076cbe58d24',
        name: 'url',
        initialValue: '',
        valueTypeName: 'string',
      },
      {
        id: '2bdde20e-6163-494f-a430-e9483390d315',
        name: 'reset',
        initialValue: false,
        valueTypeName: 'boolean',
      },
      {
        id: 'd385fe1a-9a7f-4b09-b54e-ba5f8439fb67',
        name: 'summaries',
        initialValue: '[]',
        valueTypeName: 'array',
      },
    ],
    graphInputs: [],
    customEvents: [],
    graphOutputs: [],
  },
} as SpellInterface

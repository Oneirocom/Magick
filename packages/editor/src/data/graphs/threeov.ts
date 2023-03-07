const threeov = {
  id: 'demo@0.1.0',
  nodes: {
    '232': {
      id: 232,
      data: {
        name: 'Input - Default',
        text: '',
        display: '',
        outputs: [],
        success: false,
        socketKey: '9d61118c-3c5a-4379-9dae-41965e56207f',
        useDefault: false,
        dataControls: {
          name: {
            expanded: true,
          },
          useDefault: {
            expanded: true,
          },
          playtestToggle: {
            expanded: true,
          },
        },
        defaultValue: 'hmmmmmm',
        playtestToggle: {
          receivePlaytest: true,
        },
      },
      inputs: {},
      outputs: {
        output: {
          connections: [
            {
              node: 236,
              input: 'threeov',
              data: {},
            },
          ],
        },
      },
      position: [-498.5704117140466, 62.08164172790682],
      name: 'Input',
    },
    '233': {
      id: 233,
      data: {
        name: 'output-233',
        display: 'test',
        success: false,
        socketKey: 'a4362936-dc54-4d46-9966-eca1440ce22b',
        dataControls: {
          name: {
            expanded: true,
          },
          sendToAvatar: {
            expanded: true,
          },
          sendToPlaytest: {
            expanded: true,
          },
        },
        sendToAvatar: false,
        sendToPlaytest: true,
      },
      inputs: {
        input: {
          connections: [
            {
              node: 235,
              output: 'output',
              data: {},
            },
          ],
        },
        trigger: {
          connections: [
            {
              node: 235,
              output: 'trigger',
              data: {},
            },
          ],
        },
      },
      outputs: {
        trigger: {
          connections: [],
        },
      },
      position: [640.3969066644225, -16.699914345651415],
      name: 'Output',
    },
    '235': {
      id: 235,
      data: {
        stop: '###',
        topP: 1,
        maxTokens: 100,
        modelName: 'text-davinci-003',
        temperature: 0.5,
        dataControls: {
          stop: {
            expanded: true,
          },
          topP: {
            expanded: true,
          },
          maxTokens: {
            expanded: true,
          },
          modelName: {
            expanded: true,
          },
          temperature: {
            expanded: true,
          },
          presencePenalty: {
            expanded: true,
          },
          frequencyPenalty: {
            expanded: true,
          },
        },
      },
      inputs: {
        string: {
          connections: [
            {
              node: 236,
              output: 'finalOutput',
              data: {},
            },
          ],
        },
        settings: {
          connections: [],
        },
        trigger: {
          connections: [
            {
              node: 236,
              output: 'trigger',
              data: {},
            },
          ],
        },
      },
      outputs: {
        trigger: {
          connections: [
            {
              node: 233,
              input: 'trigger',
              data: {},
            },
          ],
        },
        output: {
          connections: [
            {
              node: 233,
              input: 'input',
              data: {},
            },
          ],
        },
      },
      position: [250.17839681186064, 89.12812712670575],
      name: 'Text Completion',
    },
    '236': {
      id: 236,
      data: {
        code: "\n// inputs: dictionary of inputs based on socket names\n// data: internal data of the node to read or write to nodes data state\n// state: access to the current game state in the state manager window. Return state to update the state.\nfunction worker({\n  threeov,\n  }, data)  {\n  // Keys of the object returned must match the names\n  // of your outputs you defined.\n  // To update the state, you must return the modified state.\n  console.log(\"data\", data)\n  console.log(\"threeov\", threeov)\n    let output = threeov;\n    let prompt = output.personality;\n    let finalPrompt = prompt\n        .replaceAll('#speaker', output.Speaker)\n        .replaceAll('#input', output.Input)\n        .replaceAll('#agent', output.Agent)\n        .replaceAll('#conversation', output.Conversation)\n        .replaceAll('undefined\\n','' ).replaceAll('undefined','')\n        .slice(-5000)\n\n    let finaloutput = finalPrompt;\n\n  return { \n    finalOutput: finaloutput\n    }\n}\n",
        error: false,
        inputs: [
          {
            name: 'threeov',
            taskType: 'output',
            socketKey: 'threeov',
            socketType: 'anySocket',
            connectionType: 'input',
          },
        ],
        outputs: [
          {
            name: 'finalOutput',
            taskType: 'output',
            socketKey: 'finalOutput',
            socketType: 'anySocket',
            connectionType: 'output',
          },
        ],
        success: false,
        dataControls: {
          code: {
            expanded: true,
          },
          name: {
            expanded: true,
          },
          inputs: {
            expanded: true,
          },
          outputs: {
            expanded: true,
          },
        },
      },
      inputs: {
        threeov: {
          connections: [
            {
              node: 232,
              output: 'output',
              data: {},
            },
          ],
        },
        trigger: {
          connections: [
            {
              node: 124,
              output: 'trigger',
              data: {},
            },
          ],
        },
      },
      outputs: {
        finalOutput: {
          connections: [
            {
              node: 235,
              input: 'string',
              data: {},
            },
          ],
        },
        trigger: {
          connections: [
            {
              node: 235,
              input: 'trigger',
              data: {},
            },
          ],
        },
      },
      position: [-113.03281692890891, 39.467032562717385],
      name: 'Code',
    },
  },
  comments: [],
}

export default threeov

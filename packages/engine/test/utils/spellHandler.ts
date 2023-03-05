import { MagickComponent, Spell } from '../../src/lib/types'
import { SpellRunner } from '../../src/lib/spellManager'
import { buildMagickInterface } from './buildMagickInterface'

const createTestSpell = (node: MagickComponent<any>): Spell => ({
  name: 'test',
  graph: {
    id: 'test', 
    nodes: {
      232: {
        id: 232,
        data: {
          playtestToggle: {
            receivePlaytest: false,
            outputs: []
          },
          socketKey: "test",
          text: "Input text here",
          dataControls: {
            inputType: {
              expanded: true
            },
            useDefault: {
              expanded: true
            },
            defaultValue: {
              expanded: true
            }
          },
          name: "Input",
          outputs: [],
          isInput: true,
          useDefault: true,
          defaultValue: "hello"
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [
              {
                node: 233,
                input: "trigger",
                data: {
                  hello: "hello"
                }
              },
              {
                node: 234,
                input: "trigger",
                data: {
                  hello: "hello"
                }
              }
            ]
          },
          output: {
            connections: [
              {
                node: 233,
                input: "input",
                data: {
                  hello: "hello"
                }
              },
              {
                node: 234,
                input: "string",
                data: {
                  hello: "hello"
                }
              }
            ]
          }
        },
        position: [
          0,
          0
        ],
        name: "Input"
      },
      233: {
        id: 233,
        data: {
          name: "Output 233",
          sendToPlaytest: true,
          sendToAvatar: false,
          socketKey: "test"
        },
        inputs: {
          trigger: {
            connections: [
              {
                node: 232,
                output: "trigger",
                data: {
                  hello: "hello"
                }
              },
              {
                node: 234,
                output: "trigger",
                data: {
                  hello: "hello"
                }
              }
            ]
          },
          input: {
            connections: [
              {
                node: 232,
                output: "output",
                data: {
                  hello: "hello"
                }
              },
              {
                node: 234,
                output: "output",
                data: {
                  hello: "hello"
                }
              }
            ]
          }
        },
        outputs: {
          trigger: {
            connections: []
          },
          output: {
            connections: []
          }
        },
        position: [
          0,
          0
        ],
        name: "Output"
      },
      234: {
        id: 234,
        inputs: {
          trigger: {
            connections: [
              {
                node: 232,
                output: "trigger",
                data: {
                  hello: "hello"
                }
              }
            ]
          },
          string: {
            connections: [
              {
                node: 232,
                output: "output",
                data: {
                  hello: "hello"
                }
              }
            ]
          }
        },
        outputs: {
          trigger: {
            connections: [
              {
                node: 233,
                input: "trigger",
                data: {
                  hello: "hello"
                }
              }
            ]
          },
          output: {
            connections: [
              {
                node: 233,
                input: "input",
                data: {
                  hello: "hello"
                }
              }
            ]
          }
        },
        position: [
          0,
          0
        ],
        ...node,
        data: {},
      }
    }
  },
  id: 'test@test',
  projectId: 'test'
})

export const runTestSpell = async (node: MagickComponent<any>) => {
  const magickInterface = buildMagickInterface() as any
  const spellRunner = new SpellRunner({ magickInterface })
  const spell = createTestSpell(node)
  // Load the spell in to the spell runner
  await spellRunner.loadSpell(spell)

  // Get the outputs from running the spell
  const outputs = await spellRunner.runComponent({
    inputs: Object.values(spell.graph.nodes).map(node => node.inputs)
  })
  return outputs
}
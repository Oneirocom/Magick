import Handlebars from 'handlebars'
import {
  NodeCategory,
  SocketsList,
  Variable,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

export const textTemplate = makeFunctionNodeDefinition({
  typeName: 'logic/string/template',
  category: NodeCategory.Logic,
  label: 'Text Template',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['hiddenProperties', 'textEditorOptions'],
    },
    textEditorData: {
      valueType: 'string',
      defaultValue: '',
    },
    textEditorOptions: {
      valueType: 'object',
      defaultValue: {
        options: {
          language: 'handlebars',
          name: 'Text template',
        },
      },
    },
    socketInputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: configuration => {
    const startSockets = []

    const socketArray = configuration?.socketInputs.length
      ? configuration.socketInputs
      : []

    const sockets: SocketsList =
      socketArray.map((socketInput, index) => {
        return {
          key: socketInput.name,
          name: socketInput.name,
          valueType: socketInput.valueType,
        }
      }) || []

    return [...startSockets, ...sockets]
  },
  out: {
    result: 'string',
  },
  exec: ({ write, read, configuration }) => {
    const inputs = configuration.socketInputs.reduce((acc, socketInput) => {
      acc[socketInput.name] = read(socketInput.name)
      return acc
    }, {})

    const string = configuration.textEditorData.replace('\r\n', '\n')

    const template = Handlebars.compile(string, { noEscape: true })
    const compiled = template(inputs)
    write('result', compiled)
  },
})

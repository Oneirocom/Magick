import Handlebars from 'handlebars'
import {
  InputSocketSpecJSON,
  NodeCategory,
  SocketsList,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

export const textTemplate = makeFunctionNodeDefinition({
  typeName: 'logic/string/template',
  aliases: ['logic/string/textTemplate'],
  category: NodeCategory.Logic,
  label: 'Text Template',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: [
        'hiddenProperties',
        'textEditorOptions',
        'textEditorData',
        'socketValues',
      ],
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
    socketValues: {
      valueType: 'array',
      defaultValue: ['string', 'array', 'boolean', 'integer', 'float'],
    },
    socketInputs: {
      valueType: 'array',
      defaultValue: [],
    },
  },
  in: configuration => {
    const startSockets = [] as any[]

    const socketArray = configuration?.socketInputs.length
      ? configuration.socketInputs
      : []

    const sockets: SocketsList =
      socketArray.map((socketInput: InputSocketSpecJSON) => {
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
    const inputs = configuration.socketInputs.reduce(
      (acc: Record<string, any>, socketInput: InputSocketSpecJSON) => {
        acc[socketInput.name] = read(socketInput.name)
        return acc
      },
      {}
    )

    const string = configuration.textEditorData.replace('\r\n', '\n')

    Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      // @ts-ignore
      return arg1 == arg2 ? options.fn(this) : options.inverse(this)
    })

    const template = Handlebars.compile(string, { noEscape: true })
    const compiled = template(inputs)
    write('result', compiled)
  },
})

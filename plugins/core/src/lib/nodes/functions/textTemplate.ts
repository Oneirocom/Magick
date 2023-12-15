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
    socketInputs: {
      valueType: 'array',
      defaultValue: [
        {
          key: 'variable 1',
          valueType: 'string',
          defaultValue: 'my variable',
        },
      ],
    },
  },
  in: configuration => {
    const startSockets = [
      {
        key: 'template',
        valueType: 'string',
      },
    ]

    const socketArray = configuration?.socketInputs.length
      ? configuration.socketInputs
      : []

    const sockets: SocketsList =
      socketArray.map((socketInput, index) => {
        return {
          key: socketInput.key,
          valueType: socketInput.valueType,
        }
      }) || []

    console.log('TEXT TEMPLATE SOCKERS', sockets)

    return [...startSockets, ...sockets]
  },
  out: {
    result: 'string',
  },
  exec: ({ write, read, configuration }) => {
    const inputs = configuration.socketInputs.map((socketInput, index) =>
      read(socketInput.key)
    )

    const string = (read('template') as string).replace('\r\n', '\n')

    const template = Handlebars.compile(string, { noEscape: true })
    const compiled = template(inputs)
    write('result', compiled)
  },
})

import { makeFunctionNodeDefinition } from '@magickml/behave-graph'

export const parseCommand = makeFunctionNodeDefinition({
  typeName: 'logic/string/parseCommand',
  label: 'Parse Command',
  in: {
    string: {
      label: 'String',
      valueType: 'string',
    },
  },
  out: {
    command: {
      label: 'Command',
      valueType: 'string',
    },
    content: {
      label: 'Content',
      valueType: 'string',
    },
    isCommand: {
      label: 'isCommand',
      valueType: 'boolean',
    },
  },
  exec: ({ read, write }) => {
    const a = read('string') as string

    const [command, ...content] = a.split(' ')

    // check if the command starts with a /
    const isCommand = command.startsWith('/')
    write('isCommand', isCommand)
    write('command', command)
    write('content', content.join(' '))
  },
})

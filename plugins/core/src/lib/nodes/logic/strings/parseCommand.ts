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
  },
  exec: ({ read, write }) => {
    const a = read('string') as string

    const [command, ...content] = a.split(' ')
    write('command', command)
    write('content', content.join(' '))
  },
})

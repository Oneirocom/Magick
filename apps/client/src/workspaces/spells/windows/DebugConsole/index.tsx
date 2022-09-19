import { useCallback, useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import Terminal from 'react-console-emulator'
import { useAuth } from '@/contexts/AuthProvider'
import { usePubSub } from '@/contexts/PubSubProvider'
import Window from '@components/Window/Window'
import { useEditor } from '@/workspaces/contexts/EditorProvider'

export type DebugMessage = {
  message: string
}

interface Terminal {
  pushToStdout: any
}

const DebugConsole = ({ tab }) => {
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false)
  const { centerNode } = useEditor()
  const { user } = useAuth()
  const { publish, subscribe, events } = usePubSub()
  const { $TRIGGER, $DEBUG_PRINT } = events

  const terminalRef = useRef<Terminal>()

  const scroll = () => {
    setScrollToBottom(false)
    setScrollToBottom(true)
  }

  const trigger = nodeId => {
    publish($TRIGGER(tab.id, nodeId))
  }

  const formatErrorMessage = message =>
    `> Node ${message.nodeId}: Error in ${message.from} component${
      message.name ? ' ' + message.name : ''
    }.`

  const formatLogMessage = message =>
    `> Node ${message.nodeId}: Message from ${message.from} component ${
      message.name ?? 'unnamed'
    }.`

  const Message = (message, type) => (
    <div
      style={{
        lineHeight: '21px',
        color: type === 'error' ? 'var(--red)' : 'var(--green)',
      }}
    >
      <p style={{ margin: 0 }}>
        {type === 'error'
          ? formatErrorMessage(message)
          : formatLogMessage(message)}
      </p>
      <p style={{ margin: 0 }}>${message.content}</p>
      <br />
    </div>
  )

  const getMessage = message => {
    if (message.type === 'error')
      return renderToString(Message(message, message.type))
    if (message.type === 'log')
      return renderToString(Message(message, message.type))
  }

  const printToDebugger = useCallback((_, message) => {
    const terminal = terminalRef.current
    if (!terminal) return

    const msg = getMessage(message)

    terminal.pushToStdout(msg)

    scroll()
  }, [])

  const commandCallback = () => {
    scroll()
  }

  useEffect(() => {
    const unsubscribe = subscribe($DEBUG_PRINT(tab.id), printToDebugger)

    return unsubscribe as () => void
  }, [subscribe, printToDebugger, $DEBUG_PRINT])

  /**
   * Terminal commands
   */
  const commands = {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: function () {
        return `${Array.from(arguments).join(' ')}`
      },
    },
    node: {
      description: 'Center a node on the editor',
      usage: 'node <nodeId>',
      fn: function (nodeId) {
        centerNode(nodeId)
        return ''
      },
    },
    trigger: {
      description: 'Trigger a specific node to run your spell',
      usage: 'trigger <nodeId>',
      fn: trigger,
    },
  }

  // https://github.com/linuswillner/react-console-emulator/tree/e2b602f631e8b7c57c4a7407491cbfb84f357519
  return (
    <Window scrollToBottom={scrollToBottom}>
      <Terminal
        ref={terminalRef}
        commands={commands}
        dangerMode={true} // This is causing the [Object, object] line to appear in the terminal printout
        commandCallback={commandCallback}
        noNewlineParsing={true}
        promptLabel={`${user?.username}@thothai:~$`}
        style={{
          overflow: 'hidden',
          minHeight: '100%',
          maxHeight: 'initial',
        }}
        messageStyle={{ color: 'red' }}
      />
    </Window>
  )
}

export default DebugConsole

// DOCUMENTED
import { Window, usePubSub } from '@magickml/client-core'
import { useCallback, useEffect, useRef, useState } from 'react'
import Terminal from 'react-console-emulator'
import ReactJson from 'react-json-view'
import { useEditor } from '../../contexts/EditorProvider'
import { useSelector } from 'react-redux'
import { RootState } from '@magickml/state'

/**
 * The type for debug messages.
 */
export type DebugMessage = {
  message: string
}

interface Terminal {
  pushToStdout: any
}

/**
 * Debug Console component.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.tab - Tab object.
 * @returns {JSX.Element} Debug console component.
 */
const DebugConsole = ({ tab }): JSX.Element => {
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false)
  const { centerNode } = useEditor()
  const { publish, subscribe, events } = usePubSub()
  const { $TRIGGER, $DEBUG_PRINT } = events

  const { currentAgentId } = useSelector<RootState>(
    state => state.globalConfig
  ) as any

  const terminalRef = useRef<Terminal>()

  /**
   * Scroll to the bottom of the terminal.
   */
  const scroll = (): void => {
    setScrollToBottom(false)
    setScrollToBottom(true)
  }

  /**
   * Trigger a node.
   *
   * @param {number} nodeId - Node ID.
   */
  const trigger = (nodeId: number): void => {
    publish($TRIGGER(tab.id, nodeId))
  }

  /**
   * Format an error message.
   *
   * @param {Object} message - Message object.
   * @returns {string} Formatted error message.
   */
  const formatErrorMessage = (message): string =>
    `> Node ${message.nodeId}: Error in ${message.from} component${message.name ? ' ' + message.name : ''
    }.`

  /**
   * Format a log message.
   *
   * @param {Object} message - Message object.
   * @returns {string} Formatted log message.
   */
  const formatLogMessage = (message): string =>
    `> Node ${message.nodeId}: Message from ${message.from} component ${message.name ? ' ' + message.name : ''
    }.`

  /**
   * Render a message in the terminal.
   *
   * @param {Object} message - Message object.
   * @param {string} type - Message type (error or log).
   * @returns {JSX.Element} Rendered message.
   */
  const Message = (message, type): JSX.Element => {
    return (
      <div
        style={{
          lineHeight: '21px',
          color: type === 'error' ? 'var(--red)' : 'var(--green)',
        }}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <p style={{ margin: 0 }}>
          {type === 'error'
            ? formatErrorMessage(message)
            : formatLogMessage(message)}
        </p>
        <ReactJson
          src={message}
          name={message.nodeId}
          enableClipboard={false}
          theme="twilight"
          collapsed={true}
          style={{ overflow: 'auto' }}
        />
        <br />
      </div>
    )
  }

  /**
   * Get a formatted message for the terminal.
   *
   * @param {Object} message - Message object.
   * @returns {string} Formatted message for the terminal.
   */
  const getMessage = _message => {
    const message = _message.content
      ? {
        ..._message,
        ...JSON.parse(_message.content),
      }
      : _message

    delete message.content

    return Message(message, message.type)
  }

  // Callback function to print messages to the debugger.
  const printToDebugger = useCallback((_, message): void => {
    const terminal = terminalRef.current
    if (!terminal) return

    const msg = getMessage(message)
    terminal.pushToStdout(msg)

    scroll()
  }, [])

  // Callback function for terminal commands.
  const commandCallback = (): void => {
    scroll()
  }

  useEffect(() => {
    const unsubscribe = subscribe($DEBUG_PRINT(tab.id), printToDebugger)

    return unsubscribe as () => void
  }, [subscribe, printToDebugger, $DEBUG_PRINT])

  // Terminal commands.
  const commands = {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: function () {
        // eslint-disable-next-line prefer-rest-params
        return `${Array.from(arguments).join(' ')}`
      },
    },
    node: {
      description: 'Center a node on the editor',
      usage: 'node <nodeId>',
      fn: function (nodeId: number) {
        centerNode(nodeId)
        return ''
      },
    },
    trigger: {
      description: 'Trigger a specific node to run your spell',
      usage: 'trigger <nodeId>',
      fn: trigger,
    },
    command: {
      description: 'Send a command to the agent',
      usage: 'command <command>',
      fn: function (command: string) {
        publish(events.SEND_COMMAND, {
          agentId: currentAgentId,
          command,
        })
        return `Sent agent command ${command} to agent ${currentAgentId}`
      }

    }
  }

  return (
    <Window scrollToBottom={scrollToBottom}>
      <Terminal
        ref={terminalRef}
        commands={commands}
        dangerMode={true}
        commandCallback={commandCallback}
        noNewlineParsing={true}
        promptLabel={`~$`}
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

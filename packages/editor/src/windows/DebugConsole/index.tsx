// GENERATED 
import { Window } from '@magickml/client-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import Terminal from 'react-console-emulator';
import { renderToString } from 'react-dom/server';
import { useEditor } from '../../contexts/EditorProvider';
import { usePubSub } from '../../contexts/PubSubProvider';

/**
 * The type for debug messages.
 */
export type DebugMessage = {
  message: string;
};

interface Terminal {
  pushToStdout: any;
}

/**
 * Debug Console component.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.tab - Tab object.
 * @returns {JSX.Element} Debug console component.
 */
const DebugConsole = ({ tab }): JSX.Element => {
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);
  const { centerNode } = useEditor();
  const { publish, subscribe, events } = usePubSub();
  const { $TRIGGER, $DEBUG_PRINT } = events;

  const terminalRef = useRef<Terminal>();

  /**
   * Scroll to the bottom of the terminal.
   */
  const scroll = (): void => {
    setScrollToBottom(false);
    setScrollToBottom(true);
  };

  /**
   * Trigger a node.
   *
   * @param {string} nodeId - Node ID.
   */
  const trigger = (nodeId: string): void => {
    publish($TRIGGER(tab.id, nodeId));
  };

  /**
   * Format an error message.
   *
   * @param {Object} message - Message object.
   * @returns {string} Formatted error message.
   */
  const formatErrorMessage = (message): string =>
    `> Node ${message.nodeId}: Error in ${message.from} component${
      message.name ? ' ' + message.name : ''
    }.`;

  /**
   * Format a log message.
   *
   * @param {Object} message - Message object.
   * @returns {string} Formatted log message.
   */
  const formatLogMessage = (message): string =>
    `> Node ${message.nodeId}: Message from ${message.from} component ${
      message.name ?? 'unnamed'
    }.`;

  /**
   * Render a message in the terminal.
   *
   * @param {Object} message - Message object.
   * @param {string} type - Message type (error or log).
   * @returns {JSX.Element} Rendered message.
   */
  const Message = (message, type): JSX.Element => (
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
      <p style={{ margin: 0 }}>{message.content}</p>
      <br />
    </div>
  );

  /**
   * Get a formatted message for the terminal.
   *
   * @param {Object} message - Message object.
   * @returns {string} Formatted message for the terminal.
   */
  const getMessage = (message): string => {
    if (message.type === 'error') {
      return renderToString(Message(message, message.type));
    }
    if (message.type === 'log') {
      return renderToString(Message(message, message.type));
    }
  };

  // Callback function to print messages to the debugger.
  const printToDebugger = useCallback((_, message): void => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    const msg = getMessage(message);
    terminal.pushToStdout(msg);

    scroll();
  }, []);

  // Callback function for terminal commands.
  const commandCallback = (): void => {
    scroll();
  };

  useEffect(() => {
    const unsubscribe = subscribe($DEBUG_PRINT(tab.id), printToDebugger);

    return unsubscribe as () => void;
  }, [subscribe, printToDebugger, $DEBUG_PRINT]);

  // Terminal commands.
  const commands = {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: function () {
        return `${Array.from(arguments).join(' ')}`;
      },
    },
    node: {
      description: 'Center a node on the editor',
      usage: 'node <nodeId>',
      fn: function (nodeId: string) {
        centerNode(nodeId);
        return '';
      },
    },
    trigger: {
      description: 'Trigger a specific node to run your spell',
      usage: 'trigger <nodeId>',
      fn: trigger,
    },
  };

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
  );
};

export default DebugConsole;
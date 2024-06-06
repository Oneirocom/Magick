import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import format from 'date-fns/format'
import { VariableSizeList } from 'react-window'
import ReactJson from 'react-json-view'
import AutoSizer from 'react-virtualized-auto-sizer'
import {
  useSelectAgentsError,
  useSelectAgentsLog,
  useSelectAgentsSpell,
} from 'client/state'
import { useModal } from '../../contexts/ModalProvider'

export type Log = {
  type: string
  timestamp: string
  message: string
  messageType: string
}

const LIST_ITEM_HEIGHT = 25

const LogHeader = ({
  showRawLogs,
  setShowRawLogs,
  showSpellLogs,
  showLogLogs,
  showErrorLogs,
  setShowLogLogs,
  setShowSpellLogs,
  setShowErrorLogs,
}: {
  showRawLogs: boolean
  setShowRawLogs: React.Dispatch<React.SetStateAction<boolean>>
  showSpellLogs: boolean
  showLogLogs: boolean
  showErrorLogs: boolean
  setShowLogLogs: React.Dispatch<React.SetStateAction<boolean>>
  setShowSpellLogs: React.Dispatch<React.SetStateAction<boolean>>
  setShowErrorLogs: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div className="flex mb-6 border-b border-gray-800 pb-5">
      <div className="flex gap-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showRawLogs}
            onChange={() => setShowRawLogs(prev => !prev)}
            className="w-4 h-4 mr-2 border rounded border-gray-700 focus:border-blue-500"
          />
          <span>Raw</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showSpellLogs}
            onChange={() => setShowSpellLogs(prev => !prev)}
            className="w-4 h-4 mr-2 border rounded border-gray-700 focus:border-blue-500"
          />
          <span>Spell</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showLogLogs}
            onChange={() => setShowLogLogs(prev => !prev)}
            className="w-4 h-4 mr-2 border rounded border-gray-700 focus:border-blue-500"
          />
          <span>Info</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showErrorLogs}
            onChange={() => setShowErrorLogs(prev => !prev)}
            className="w-4 h-4 mr-2 border rounded border-gray-700 focus:border-blue-500"
          />
          <span>Error</span>
        </label>
      </div>
    </div>
  )
}

const LogMessage = ({
  log,
  style,
  onExpandCollapse,
  showRawLogs,
}: {
  log: Log
  style: any
  onExpandCollapse: (height: number) => void
  showRawLogs: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isRefAvailable = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const expandRef = useRef<HTMLDivElement>(null)
  const cleanExpandRef = useRef<HTMLDivElement>(null)
  const isExpandedRef = useRef(isExpanded)

  const timestamp = format(new Date(log.timestamp), 'MMM-dd-yy-HH:mm')

  useEffect(() => {
    isExpandedRef.current = isExpanded
  }, [isExpanded])

  useLayoutEffect(() => {
    const expandedRef = showRawLogs ? expandRef.current : cleanExpandRef.current

    if (expandedRef) {
      const resizeObserver = new ResizeObserver(() => {
        const expandHeight = expandedRef.offsetHeight ?? 0
        const expandedHeight = LIST_ITEM_HEIGHT + expandHeight

        if ((isExpandedRef.current && showRawLogs) || !showRawLogs) {
          onExpandCollapse(expandedHeight)
        } else {
          onExpandCollapse(LIST_ITEM_HEIGHT)
        }
      })

      // Start observing
      resizeObserver.observe(expandedRef)

      // Cleanup
      return () => resizeObserver.disconnect()
    }
  }, [showRawLogs, cleanExpandRef.current, expandRef.current])

  useEffect(() => {
    if (!isRefAvailable) return

    // todo keep an eye on this for performance stuff.
    const resizeObserver = new ResizeObserver(() => {
      const expandHeight = expandRef.current?.offsetHeight ?? 0
      const expandedHeight = LIST_ITEM_HEIGHT + expandHeight

      if (isExpandedRef.current) {
        onExpandCollapse(expandedHeight)
      } else {
        onExpandCollapse(LIST_ITEM_HEIGHT)
      }
    })

    // Start observing
    if (expandRef.current) {
      resizeObserver.observe(expandRef.current)
    }

    // Cleanup
    return () => resizeObserver.disconnect()
  }, [isRefAvailable])

  const textColor = log.type === 'error' ? 'text-red-500' : 'text-white'

  return (
    <div
      className="flex flex-col justify-between p-1 border-b border-[#262730] items-start cursor-pointer hover:[background-color:var(--slate-15)]"
      style={style}
      ref={containerRef}
    >
      {showRawLogs && (
        <>
          <div
            className="flex flex-row justify-between w-full items-center gap-5 "
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="text-md text-[#328597] whitespace-nowrap">
              {timestamp}
            </span>
            <span
              className={`text-md ${textColor} break-all flex-grow truncate`}
            >
              {log.messageType}: {log.message}
            </span>
            <div>
              {isExpanded ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 15L12 9L18 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              )}
            </div>
          </div>
          <div ref={expandRef}>
            {isExpanded && (
              <div className="mt-2">
                <ReactJson
                  src={log}
                  enableClipboard={false}
                  theme="twilight"
                  collapsed={false}
                  style={{ overflow: 'auto', background: 'transparent' }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {!showRawLogs && (
        <div className="flex flex-col justify-between w-full items-start">
          <div className="flex flex-row justify-between w-full items-center gap-5">
            <span
              className={`text-md ${textColor} break-all flex-grow`}
              ref={cleanExpandRef}
            >
              {log.messageType}: {log.message}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const LogContainer = ({
  logs,
  autoscroll,
  showRawLogs,
}: {
  logs: any[]
  autoscroll: boolean
  showRawLogs: boolean
}) => {
  const listRef = useRef<any>(null)
  const rowHeights = useRef<{ [key: number]: number }>({})

  const getItemSize = (index: number) => {
    return rowHeights.current[index] || LIST_ITEM_HEIGHT // Default height
  }

  const handleExpandCollapse = (index: number, size: number) => {
    rowHeights.current[index] = size
    listRef.current.resetAfterIndex(index)
  }

  useEffect(() => {
    if (autoscroll && listRef.current) {
      listRef.current.scrollToItem(logs.length - 1) // Scroll to the last log
    }
  }, [autoscroll, logs])

  return (
    <div className="flex-grow border justify-between rounded border-[#262730] [background-color:var(--deep-background-color)]">
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            ref={listRef}
            height={height}
            itemCount={logs.length}
            itemSize={getItemSize}
            width={width}
          >
            {({
              index,
              style,
            }: {
              index: number
              style: React.CSSProperties
            }) => (
              <LogMessage
                showRawLogs={showRawLogs}
                key={index}
                log={logs[index]}
                style={style}
                onExpandCollapse={size => handleExpandCollapse(index, size)}
              />
            )}
          </VariableSizeList>
        )}
      </AutoSizer>
    </div>
  )
}

const LogFooter = ({
  autoscroll,
  setAutoscroll,
  onClear,
}: {
  autoscroll: boolean
  setAutoscroll: React.Dispatch<React.SetStateAction<boolean>>
  onClear: () => void
}) => {
  return (
    <div className="flex items-center justify-between mt-4 p-3 rounded border border-[#262730]">
      <div>
        <input
          id="default-checkbox"
          type="checkbox"
          value=""
          checked={autoscroll}
          onChange={() => setAutoscroll(prev => !prev)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="default-checkbox"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Autoscroll with output
        </label>
      </div>
      <button className="flex" onClick={onClear}>
        Clear
      </button>
    </div>
  )
}

const LogsComponent = () => {
  const { lastItem: lastLog } = useSelectAgentsLog()
  const { lastItem: lastSpellLog } = useSelectAgentsSpell()
  const { lastItem: lastErrorLog } = useSelectAgentsError()
  const [combinedData, setCombinedData] = useState<Log[]>([])
  const [autoscroll, setAutoscroll] = useState(true)
  const [showSpellLogs, setShowSpellLogs] = useState(false)
  const [showLogLogs, setShowLogLogs] = useState(true)
  const [showErrorLogs, setShowErrorLogs] = useState(true)
  const [showRawLogs, setShowRawLogs] = useState(false)

  const { openModal } = useModal()

  useEffect(() => {
    // Create a new entry only if the new log item is not undefined
    const newEntries: Log[] = [] // Specify type for newEntries

    const addIfUnique = (newLog: Log, type: string) => {
      // Specify parameter types
      if (
        newLog &&
        !combinedData.some(
          log =>
            log.timestamp === newLog.timestamp && log.message === newLog.message
        )
      ) {
        newEntries.push({ ...newLog, messageType: type })

        // Check if the error is related to budget exceeded or payment required
        if (
          type === 'error' &&
          (newLog.message.includes('has exceeded their budget') ||
            newLog.message.includes('Payment Required'))
        ) {
          openModal({
            modal: 'outOfFundsModal',
          })
        }
      }
    }

    addIfUnique(lastLog as Log, 'log') // Cast to Log type to avoid errors
    // addIfUnique(lastSpellLog as Log, 'spell')
    addIfUnique(lastErrorLog as Log, 'error')

    // Update the combinedData state with new entries if any
    if (newEntries.length > 0) {
      setCombinedData(prev => [...prev, ...newEntries])
    }
  }, [lastLog, lastSpellLog, lastErrorLog])

  const onClear = () => {
    setCombinedData([]) // Clear combinedData instead of logs
  }

  const filterLogs = (logs: any[]) => {
    if (logs.length === 0) return []
    return logs.filter(log => {
      if (!log) return false
      if (!log.log && typeof log.log !== 'undefined') return false
      if (!log.message) return false
      if (log.messageType === 'spell' && showSpellLogs) return true
      if (log.messageType === 'log' && showLogLogs) return true
      if (log.messageType === 'error' && showErrorLogs) return true
      return false
    })
  }

  // If you're filtering logs for display, you can use a memoized version of combinedData
  const logs = useMemo(
    () => filterLogs(combinedData),
    [combinedData, showSpellLogs, showLogLogs]
  )

  return (
    <div className="flex flex-col h-full p-4 text-white">
      {/* Clean up the props to this header */}
      <LogHeader
        setShowRawLogs={setShowRawLogs}
        showRawLogs={showRawLogs}
        showLogLogs={showLogLogs}
        showSpellLogs={showSpellLogs}
        setShowSpellLogs={setShowSpellLogs}
        setShowLogLogs={setShowLogLogs}
        setShowErrorLogs={setShowErrorLogs}
        showErrorLogs={showErrorLogs}
      />
      <LogContainer
        logs={logs}
        autoscroll={autoscroll}
        showRawLogs={showRawLogs}
      />
      <LogFooter
        autoscroll={autoscroll}
        setAutoscroll={setAutoscroll}
        onClear={onClear}
      />
    </div>
  )
}

export default LogsComponent

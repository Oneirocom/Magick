import { useEffect, useLayoutEffect, useRef, useState } from "react";
import format from "date-fns/format"
import { VariableSizeList } from "react-window";
import ReactJson from 'react-json-view'
import AutoSizer from "react-virtualized-auto-sizer";
import { useSelectAgentsLog, useSelectAgentsSpell } from "client/state";

type Log = {
  type: string;
  timestamp: string;
  message: string;
  messageType: string;
};
interface Props {
  logs: Array<Log>;
}

const LIST_ITEM_HEIGHT = 25;

const LogHeader = ({ showSpellLogs, showLogLogs, setShowLogLogs, setShowSpellLogs }) => {
  return (<div className="flex justify-between mb-6 border-b border-gray-800 pb-5">
    <h1 className="text-l font-semibold">Application Logs</h1>
    <div className="flex gap-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={showSpellLogs}
          onChange={() => setShowSpellLogs(prev => !prev)}
          className="w-5 h-5 mr-2 border rounded border-gray-700 focus:border-blue-500"
        />
        <span>Spell</span>
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={showLogLogs}
          onChange={() => setShowLogLogs(prev => !prev)}
          className="w-5 h-5 mr-2 border rounded border-gray-700 focus:border-blue-500"
        />
        <span>Info</span>
      </label>
    </div>
  </div>
  )
}


const LogMessage = ({ log, style, onExpandCollapse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefAvailable, setRefAvailable] = useState(false);
  const [listenerSetUp, setListenerSetUp] = useState(false);
  const containerRef = useRef(null);
  const expandRef = useRef(null);
  const isExpandedRef = useRef(isExpanded);

  const timestamp = format(new Date(log.timestamp), 'MMM-dd-yy-HH:mm')

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  useLayoutEffect(() => {
    if (expandRef.current) {
      setRefAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (!isRefAvailable) return;

    // todo keep an eye on this for performance stuff.
    const resizeObserver = new ResizeObserver(() => {
      const expandHeight = expandRef.current.offsetHeight;
      const expandedHeight = LIST_ITEM_HEIGHT + expandHeight;

      if (isExpandedRef.current) {
        onExpandCollapse(expandedHeight);
      } else {
        onExpandCollapse(LIST_ITEM_HEIGHT);
      }
    });

    // Start observing
    resizeObserver.observe(expandRef.current);

    // Cleanup
    return () => resizeObserver.disconnect();
  }, [isRefAvailable]);

  return (
    <div className="flex flex-col justify-between p-1 border-b border-[#262730] items-start cursor-pointer hover:[background-color:var(--slate-15)]" style={style} ref={containerRef}>
      <div className="flex flex-row justify-between w-full items-center gap-5 " onClick={() => setIsExpanded(!isExpanded)}>
        <span className="text-md text-[#328597] whitespace-nowrap">{timestamp}</span>
        <span className="text-md text-white break-all flex-grow truncate">{log.message}</span>
        <div>
          {isExpanded ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
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
    </div>
  );
};

const LogContainer = ({ logs, autoscroll }) => {
  const listRef = useRef(null);
  const rowHeights = useRef({});

  const getItemSize = (index) => {
    return rowHeights.current[index] || LIST_ITEM_HEIGHT;  // Default height
  };

  const handleExpandCollapse = (index, size) => {
    rowHeights.current[index] = size;
    listRef.current.resetAfterIndex(index);
  };

  // useEffect(() => {
  //   if (autoscroll && listRef.current) {
  //     listRef.current.scrollToItem(logs.length - 1);  // Scroll to the last log
  //   }
  // }, [autoscroll, logs]);

  return (
    <div className="flex-grow border rounded border-[#262730] [background-color:var(--deep-background-color)]">
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            ref={listRef}
            height={height}
            itemCount={logs.length}
            itemSize={getItemSize}
            width={width}
          >
            {({ index, style }) => (
              <LogMessage
                key={index}
                log={logs[index]}
                style={style}
                onExpandCollapse={(size) => handleExpandCollapse(index, size)}
              />
            )}
          </VariableSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

const LogFooter = ({ autoscroll, setAutoscroll }) => {
  return (<div className="flex items-center mt-4 p-3 rounded border border-[#262730]">
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
  </div>)
}


const LogsComponent = () => {
  const { data: LogData } = useSelectAgentsLog()
  const { data: spellData } = useSelectAgentsSpell()
  const [combinedData, setCombinedData] = useState([]);
  const [autoscroll, setAutoscroll] = useState(true);
  const [showSpellLogs, setShowSpellLogs] = useState(true);
  const [showLogLogs, setShowLogLogs] = useState(true);

  useEffect(() => {
    if (!spellData || !LogData) return;

    const merged = [...LogData, ...spellData].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      return dateA.getTime() - dateB.getTime();
    });

    setCombinedData(merged);
  }, [spellData, LogData]);

  const filterLogs = (logs) => {
    return logs.filter(log => {
      if (log.messageType === 'spell' && showSpellLogs) return true;
      if (log.messageType === 'log' && showLogLogs) return true;
      return false;
    });
  }

  return (
    <div className="flex flex-col h-full p-4 text-white">
      {/* Clean up the props to this header */}
      <LogHeader showLogLogs={showLogLogs} showSpellLogs={showSpellLogs} setShowSpellLogs={setShowSpellLogs} setShowLogLogs={setShowLogLogs} />
      <LogContainer logs={filterLogs(combinedData)} autoscroll={autoscroll} />
      <LogFooter autoscroll={autoscroll} setAutoscroll={setAutoscroll} />
    </div>
  );
};


export default LogsComponent;

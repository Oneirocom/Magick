import { useEffect, useRef, useState } from "react";
import ReactJson from 'react-json-view'

type Log = {
  type: string;
  timestamp: string;
  message: string;
  messageType: string;
};
interface Props {
  logs: Array<Log>;
}

const LogMessage = ({ log }: { log: Log }) => {
  // State to track if the message is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col justify-between p-3 border-b border-[#262730] items-start cursor-pointer hover:[color:var(--slate-15)]" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="flex flex-row justify-between w-full items-center gap-5">
        <span className="text-md text-[#328597] whitespace-nowrap">{log.timestamp}</span>
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
  );
};

const LogsComponent = ({ logs }: Props) => {
  const [autoscroll, setAutoscroll] = useState(true);
  const [showSpellLogs, setShowSpellLogs] = useState(true);
  const [showLogLogs, setShowLogLogs] = useState(true);
  const logsContainerRef = useRef(null);

  useEffect(() => {
    if (autoscroll && logsContainerRef.current) {
      const container = logsContainerRef.current as HTMLElement;
      container.scrollTop = container.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    if (log.type === 'spell' && showSpellLogs) return true;
    if (log.type === 'log' && showLogLogs) return true;
    return false;
  });


  return (
    <div className="flex flex-col h-full p-4 text-white">
      <div className="flex justify-between mb-6 border-b border-gray-800 pb-5">
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
      <div ref={logsContainerRef} className="flex-grow border rounded border-[#262730] bg-black">
        {filteredLogs.map((log, index) => (
          <LogMessage key={index} log={log} />
        ))}
      </div>

      <div className="flex items-center mt-4 p-3 rounded border border-[#262730]">
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
    </div>
  );
};


export default LogsComponent;

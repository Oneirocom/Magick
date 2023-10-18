type Log = {
  name: string;
  type: string;
};
interface Props {
  logs: Array<Log>;
}

const LogsComponent = ({ logs }: Props) => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1>Application Logs</h1>
      </div>
      <div className="border rounded border-[#262730] bg-black border-b-0">
        {logs.map((log, index) => (
          <div key={index} className="flex justify-evenly">
            <span className="text-sm text-[#328597]">{log.name}</span>
            <span className="text-sm text-white">{log.type}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center mb-4 p-3 rounded border border-[#262730]">
        <input
          id="default-checkbox"
          type="checkbox"
          value=""
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

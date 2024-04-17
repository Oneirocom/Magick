import { Scrollbars } from 'react-custom-scrollbars-2'
import { SeraphEvents } from 'servicesShared'

export const SeraphChatHistory = ({ history, scrollbars, seraphEventData }) => {
  const UserMessage = ({ message }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-transparent p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
        {message.trimStart()}
      </div>
    </div>
  )

  const SeraphMessage = ({ message }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-slate-700 p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
        {message.trimStart()}
      </div>
    </div>
  )

  const FunctionMessage = ({ functionName }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-blue-500 p-2 rounded text-white flex-1 text-sm font-mono">
        <i className="fas fa-spinner fa-spin mr-2"></i>
        Executing function: {functionName}
      </div>
    </div>
  )

  const MiddlewareMessage = ({ middlewareName }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-green-500 p-2 rounded text-white flex-1 text-sm font-mono">
        <i className="fas fa-cog fa-spin mr-2"></i>
        Executing middleware: {middlewareName}
      </div>
    </div>
  )

  const ErrorMessage = ({ error }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-red-500 p-2 rounded text-white flex-1 text-sm font-mono">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        Error: {error}
      </div>
    </div>
  )

  const InfoMessage = ({ info }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-yellow-500 p-2 rounded text-white flex-1 text-sm font-mono">
        <i className="fas fa-info-circle mr-2"></i>
        Info: {info}
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-hidden bg-[--ds-black]">
      <Scrollbars ref={ref => (scrollbars.current = ref)}>
        <ul className="list-none m-0 p-2">
          {history.map((message, index) => {
            if (message.sender === 'user') {
              return (
                <li key={index}>
                  <UserMessage message={message.content} />
                </li>
              )
            } else if (message.sender === 'assistant') {
              return (
                <li key={index}>
                  <SeraphMessage message={message.content} />
                </li>
              )
            } else {
              return <></>
            }
          })}
          {seraphEventData[SeraphEvents.functionExecution] && (
            <li>
              <FunctionMessage
                functionName={
                  seraphEventData[SeraphEvents.functionExecution].name
                }
              />
            </li>
          )}
          {seraphEventData[SeraphEvents.middlewareExecution] && (
            <li>
              <MiddlewareMessage
                middlewareName={
                  seraphEventData[SeraphEvents.middlewareExecution].name
                }
              />
            </li>
          )}
          {seraphEventData[SeraphEvents.error] && (
            <li>
              <ErrorMessage error={seraphEventData[SeraphEvents.error]} />
            </li>
          )}
          {seraphEventData[SeraphEvents.info] && (
            <li>
              <InfoMessage info={seraphEventData[SeraphEvents.info]} />
            </li>
          )}
        </ul>
      </Scrollbars>
    </div>
  )
}

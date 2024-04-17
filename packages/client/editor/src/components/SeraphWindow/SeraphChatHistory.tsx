import { Scrollbars } from 'react-custom-scrollbars-2'
import { SeraphEvents, SeraphFunction } from 'servicesShared'
import { useState } from 'react'

export const SeraphChatHistory = ({ history, scrollbars, seraphEventData }) => {
  const UserMessage = ({ message }: { message: string }) => {
    return (
      <div className="flex flex-row mb-2">
        <div className="bg-transparent p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
          {message?.trimStart()}
        </div>
      </div>
    )
  }

  const SeraphMessage = ({ message }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-slate-700 p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
        {message?.trimStart()}
      </div>
    </div>
  )

  const FunctionMessage = ({
    functionData,
  }: {
    functionData: SeraphFunction
  }) => {
    const [showResult, setShowResult] = useState(false)

    const toggleResult = () => {
      setShowResult(prevState => !prevState)
    }

    return (
      <div className="flex flex-row mb-2">
        <div className="bg-blue-500 p-2 rounded text-white flex-1 text-sm font-mono">
          <div className="flex items-center">
            {/* {functionData.icon && (
              <div className="mr-2">{functionData.icon}</div>
            )} */}
            <div>
              <div className="font-bold">{functionData.messageTitle}</div>
              <div>{functionData.message || 'Executing function...'}</div>
            </div>
          </div>
          {functionData.result && (
            <div className="mt-2">
              <button
                className="text-white underline focus:outline-none"
                onClick={toggleResult}
              >
                {showResult ? 'Hide Result' : 'Show Result'}
              </button>
              {showResult && (
                <div className="mt-2 p-2 bg-blue-600 rounded">
                  {functionData.result}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const MiddlewareMessage = ({
    middlewareData,
  }: {
    middlewareData: SeraphFunction
  }) => {
    const [showResult, setShowResult] = useState(false)

    const toggleResult = () => {
      setShowResult(prevState => !prevState)
    }

    return (
      <div className="flex flex-row mb-2">
        <div className="bg-green-500 p-2 rounded text-white flex-1 text-sm font-mono">
          <div className="flex items-center">
            {/* {middlewareData.icon && (
              <div className="mr-2">{middlewareData.icon}</div>
            )} */}
            <div>
              <div className="font-bold">{middlewareData.messageTitle}</div>
              <div>{middlewareData.message || 'Running middleware...'}</div>
            </div>
          </div>
          {middlewareData.result && (
            <div className="mt-2">
              <button
                className="text-white underline focus:outline-none"
                onClick={toggleResult}
              >
                {showResult ? 'Hide Result' : 'Show Result'}
              </button>
              {showResult && (
                <div className="mt-2 p-2 bg-green-600 rounded">
                  {middlewareData.result}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

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
                functionData={seraphEventData[SeraphEvents.functionExecution]}
              />
            </li>
          )}
          {seraphEventData[SeraphEvents.middlewareExecution] && (
            <li>
              <MiddlewareMessage
                middlewareData={
                  seraphEventData[SeraphEvents.middlewareExecution]
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

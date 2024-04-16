import { Scrollbars } from 'react-custom-scrollbars-2'

export const SeraphChatHistory = ({ history, scrollbars }) => {
  const UserMessage = ({ message }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-transparent p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
        {message}
      </div>
    </div>
  )

  const SeraphMessage = ({ message }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-slate-700 p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
        {message}
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
        </ul>
      </Scrollbars>
    </div>
  )
}

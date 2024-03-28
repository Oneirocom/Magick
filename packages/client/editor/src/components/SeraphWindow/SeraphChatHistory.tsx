import { Scrollbars } from 'react-custom-scrollbars-2'
import { useMessageHistory } from '../../hooks/useMessageHistory'

export const SeraphChatHistory = () => {
  const { history, scrollbars } = useMessageHistory()
  return (
    <div className="flex-1 overflow-hidden bg-[--ds-black]">
      <Scrollbars ref={ref => (scrollbars.current = ref)}>
        <ul className="list-none m-0 p-2">
          {history.map((message, index) => (
            <li
              key={index}
              className={`flex flex-row mb-2 ${
                message.sender === 'user' ? 'justify-end' : ''
              }`}
            >
              <div
                className={`rounded p-2 text-white flex-1 text-sm font-mono whitespace-pre-line ${
                  message.sender === 'user' ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              >
                {message.content}
              </div>
            </li>
          ))}
        </ul>
      </Scrollbars>
    </div>
  )
}

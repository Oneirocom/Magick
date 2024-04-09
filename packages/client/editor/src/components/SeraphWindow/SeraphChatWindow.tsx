import React, {
  // useEffect,
  useState,
} from 'react'
import { Window } from 'client/core'
// import { useSnackbar } from 'notistack'

import //  useConfig,
'@magickml/providers'
import {
  RootState,
  useGetSpellByNameQuery,
  // useSelectAgentsEvent,
} from 'client/state'

import { useSelector } from 'react-redux'
import { SeraphChatInput } from './SeraphChatInput'
import { SeraphChatHistory } from './SeraphChatHistory'
import { useSeraph } from '../../hooks/useSeraph'
import { useMessageHistory } from '../../hooks/useMessageHistory'
// import { useMessageQueue } from '../../hooks/useMessageQueue'
import { ISeraphEvent, SeraphRequest } from 'servicesShared'

const SeraphChatWindow = ({ tab, spellName }) => {
  // const config = useConfig()

  // const { enqueueSnackbar } = useSnackbar()
  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: ({ data }) => ({ spell: data?.data[0] }),
    }
  )
  const [value, setValue] = useState('')
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig

  const { history, scrollbars, printToConsole, setHistory } =
    useMessageHistory<ISeraphEvent>()

  const { makeSeraphRequest } = useSeraph({
    tab,
    projectId: spell?.projectId,
    agentId: currentAgentId,
    history,
    setHistory,
  })

  // Handle message sending
  const onSend = async () => {
    printToConsole(value)

    const eventPayload: SeraphRequest = {
      message: value,
      systemPrompt: spell.systemPrompt,
    }

    makeSeraphRequest(eventPayload)
    setValue('')
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  return (
    <div className="flex-grow border-0 justify-between rounded bg:[--deep-background-color]">
      <Window>
        <div className="flex flex-col h-full bg-[--ds-black] w-[96%] m-auto">
          <SeraphChatHistory history={history} scrollbars={scrollbars} />
          <SeraphChatInput onChange={onChange} value={value} onSend={onSend} />
        </div>
      </Window>
    </div>
  )
}

export default SeraphChatWindow

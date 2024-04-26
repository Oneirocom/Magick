import { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useConfig } from '@magickml/providers'
import {
  addLocalState,
  selectStateBytabId,
  upsertLocalState,
  useAppSelector,
} from 'client/state'

const defaultPlaytestData = {
  sender: 'user',
  observer: 'assistant',
}

export const usePlaytestData = (tabId: string) => {
  const config = useConfig()
  const dispatch = useDispatch()
  const localState = useAppSelector(state => {
    return selectStateBytabId(state.localState, tabId)
  })

  useEffect(() => {
    if (!localState) {
      dispatch(
        addLocalState({
          id: tabId,
          playtestData: JSON.stringify({
            ...defaultPlaytestData,
            projectId: config.projectId,
          }),
        })
      )
    }
  }, [config.projectId, dispatch, localState, tabId])

  const onDataChange = (dataText: string | undefined) => {
    if (!dataText) return
    dispatch(
      upsertLocalState({
        id: tabId,
        playtestData: dataText ?? defaultPlaytestData,
      })
    )
  }

  return { localState, onDataChange }
}

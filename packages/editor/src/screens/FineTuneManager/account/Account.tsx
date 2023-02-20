import React, { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { SWRConfig } from 'swr'
import { OpenAI } from '../../../../../../@types/openai'
import { useLocalStorage } from 'usehooks-ts'
import requestHeaders from './requestHeaders'

import { OPENAI_ENDPOINT } from '@magickml/engine'

export const AccountContext = React.createContext<{
  headers?: { [key: string]: string }
  isSignedIn: boolean
  signIn: (apiKey: string, organizationId: string) => void
  signOut: () => void
}>({
  isSignedIn: false,
  signIn: () => undefined,
  signOut: () => undefined,
})

export default function Account({ children }) {
  const [account, setAccount] = useLocalStorage<{
    apiKey: string
    organizationId: string
  } | null>('openai', null)
  const headers = useMemo(
    () => (account ? requestHeaders(account) : undefined),
    [account]
  )

  const fetcher = useCallback(
    async (path: string) => {
      if (!headers) return null

      const response = await fetch(`${OPENAI_ENDPOINT}/${path}`, {
        headers,
      })
      if (response.ok) {
        return await response.json()
      } else {
        const { error } = (await response.json()) as OpenAI.ErrorResponse
        throw new Error(error.message)
      }
    },
    [headers]
  )

  const onError = useCallback((error: Error) => toast.error(String(error)), [])

  const signIn = useCallback(
    (apiKey: string, organizationId: string) =>
      setAccount({ apiKey, organizationId }),
    [setAccount]
  )

  const signOut = useCallback(() => setAccount(null), [setAccount])

  return (
    <AccountContext.Provider
      value={{ isSignedIn: !!account, headers, signIn, signOut }}
    >
      <SWRConfig value={{ fetcher, onError }}>{children}</SWRConfig>
    </AccountContext.Provider>
  )
}

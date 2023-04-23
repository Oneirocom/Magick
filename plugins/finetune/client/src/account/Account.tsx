// DOCUMENTED
import React, { useCallback, useMemo, FC, ReactNode } from 'react'
import { toast } from 'react-toastify'
import { SWRConfig } from 'swr'
import requestHeaders from './requestHeaders'

import { OPENAI_ENDPOINT } from '../constants'
import { useLocalStorage } from 'usehooks-ts'
import { OpenAI } from '../types/openai'
import { API_ROOT_URL } from '@magickml/core'

interface IAccountProvider {
  headers?: { [key: string]: string }
  isSignedIn: boolean
  signIn: (apiKey: string, organizationId: string) => void
  signOut: () => void
}

interface IAccountProps {
  children: ReactNode
}

export const AccountContext = React.createContext<IAccountProvider>({
  isSignedIn: false,
  signIn: () => {
    /* null */
  },
  signOut: () => {
    /* null */
  },
})

/**
 * Provides User Authentication and sets up the SWR hook
 * @param {IAccountProps} IAccountProps - Wrapper component that initializes Account Context and handles authentication.
 * @returns {FC} FC
 */
const Account: FC<IAccountProps> = ({ children }): JSX.Element => {
  const [account, setAccount] = useLocalStorage<{
    openai_api_key: string
  } | null>('secrets', null)

  const headers = useMemo(
    () =>
      account
        ? requestHeaders({
            apiKey: account?.openai_api_key,
            organizationId: undefined,
          })
        : undefined,
    [account]
  )

  /**
   * @param {string} path - url path
   * @returns {Promise<void>} - returns a JSON object on success or throws an error with message if unsuccessful
   */
  const fetcher = useCallback(
    async (path: string): Promise<void> => {
      if (['datasets'].includes(path)) {
        const response = await fetch(`${API_ROOT_URL}/${path}`, {
          headers,
        })
        if (response.ok) {
          return await response.json()
        } else {
          const { error } = (await response.json()) as OpenAI.ErrorResponse
          throw new Error(error.message)
        }
      }
      if (!headers) {
        return null
      }
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

  const onError = useCallback((error: Error): void => {
    toast.error(String(error))
  }, [])

  /**
   * @param {string} apiKey - User's apiKey on OpenAI
   * @param {string} organizationId - User's organization Id on OpenAI
   * @returns {void}
   */
  const signIn = useCallback(
    (apiKey: string): void => {
      setAccount({ openai_api_key: apiKey })
    },
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

export default Account

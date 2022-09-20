import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactElement,
} from 'react'
import { uuidv4 } from '../utils/uuid'
import { setItem, getItem } from '../utils/AsyncStorage'
import { useQuery } from '../hooks/useQuery'
import { useLocation } from 'react-router-dom'
import { oAuthClientId, latitudeApiRootUrl, appRootUrl } from '../config'
import { callExpire } from '../helpers/Expire'
import LoadingScreen from '../components/LoadingScreen/LoadingScreen'

interface SessionInfoType {
  id: number
  email: string
  expiresAt: number
  username: string
  appRootUrl: string
}

export interface UserInfoType {
  id: string
  email: string
  groups: string[]
  username: string
}

const initialState = {
  session: {} as SessionInfoType | null,
  user: {} as UserInfoType | null,
  logoutAndRedirect: () => {},
  loginRedirect: (force?: boolean, returnToPath?: string) => {},
  refreshSession: (origin: string) => {},
  done: false,
}

const AuthContext = createContext(initialState)

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [done, setDone] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<SessionInfoType | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
  const query = useQuery()
  const code = query.get('code')
  const state = query.get('state')
  const location = useLocation()
  // const { models } = useDB()

  const loginRedirect = async (force = false, returnToPath = '') => {
    // User not logged in or session expired, set state and send to login
    const state = uuidv4()
    await setOauthState(state)
    await setStateStore(state, {
      origin: returnToPath ? returnToPath : window.location.pathname,
    })
    window.location.href = `${latitudeApiRootUrl}/user/auth/authorize?client_id=${oAuthClientId}&state=${state}&redirect_uri=${encodeURIComponent(
      `${appRootUrl}/`
    )}${force ? `&force=true` : ''}`
  }

  const initialize = (search?: string) => {
    // Remove auth specific query params after use
    let queryString = ''
    if (search) {
      let queryDictionary = JSON.parse(
        '{"' +
          search.substring(1).replace(/&/g, '","').replace(/=/g, '":"') +
          '"}',
        function (key, value) {
          return key === '' ? value : decodeURIComponent(value)
        }
      )

      delete queryDictionary['client_id']
      delete queryDictionary['redirect_uri']
      // TODO @seang: only remove state after consumed by the callback origin logic elsewhere
      // delete queryDictionary['state']
      delete queryDictionary['grant']
      delete queryDictionary['code']

      queryString =
        '?' +
        Object.keys(queryDictionary)
          .map(key => key + '=' + queryDictionary[key])
          .join('&')
    }

    window.history.replaceState(
      {},
      '',
      window.location.origin + window.location.pathname + queryString
    )
    // Clear query params from url bar
    removeOauthState()
    // Clean up Oauth variable
  }

  const removeData = () => {
    // removeUser()
    removeSessionId()
  }

  const approveOrRemove = async (
    sessionInfoParam: SessionInfoType,
    userInfo: UserInfoType
  ) => {
    if (
      userInfo?.id &&
      new Date(sessionInfoParam.expiresAt).valueOf() > Date.now()
    ) {
      setSessionInfo(sessionInfoParam)
      setUserInfo(userInfo)

      let search = window.location.search.toString()
      initialize(search)
    }
    setDone(true)
  }

  const logoutAndRedirect = async () => {
    await callExpire()
    removeData()
    window.location.href = `${latitudeApiRootUrl}/user/logout?returnTo=${encodeURIComponent(
      appRootUrl as string
    )}`
  }

  const refreshSession = async (origin: string) => {
    const state = uuidv4()
    removeData()
    await setStateStore(state, { origin: origin })
    window.location.href = `${latitudeApiRootUrl}/user/auth/refresh?returnTo=${encodeURIComponent(
      `${appRootUrl}/callback`
    )}&state=${state}`
  }

  useEffect(() => {
    ;(async () => {
      try {
        // Check if User has an existing sessionId in local storage
        const sessionId = await getSessionId()

        if (sessionId) {
          const sessionReq = await fetch(
            `${latitudeApiRootUrl}/user/auth/info?access_token=${sessionId}`
          )
          const userReq = await fetch(`${latitudeApiRootUrl}/user/info`, {
            headers: {
              authorization: `session ${sessionId}`,
            },
          })

          const sessionInfo = await sessionReq.json()
          const userInfo = await userReq.json()
          approveOrRemove(sessionInfo, userInfo)
        }
      } catch (error) {
        // remove invalid sessionId from local storage to prevent loops, redirect to login and return to prevent further conditions
        removeData()
        await loginRedirect()
      }

      // User has authenticated and was just redirected to the client
      if (code) {
        const authState = await getOauthState()
        // This is a critical security gate. Do not remove.
        if (authState && state === authState) {
          const tokenRequest = await fetch(
            `${latitudeApiRootUrl}/user/auth/token`,
            {
              method: 'POST',
              body: JSON.stringify({
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: `${appRootUrl}/`,
                client_id: oAuthClientId,
              }),
              headers: { 'Content-Type': 'application/json' },
            }
          )

          try {
            const tokenResponse = await tokenRequest.json()
            const { access_token } = tokenResponse
            if (!access_token) return
            await setSessionId(access_token)
            const sessionReq = await fetch(
              `${latitudeApiRootUrl}/user/auth/info?access_token=${access_token}`
            )
            const userReq = await fetch(`${latitudeApiRootUrl}/user/info`, {
              headers: {
                authorization: `session ${access_token}`,
              },
            })
            const sessionInfo = await sessionReq.json()
            const userInfo = await userReq.json()
            approveOrRemove(sessionInfo, userInfo)
          } catch (error) {
            removeData()
          }
        }
      } else {
        // Setting static user data
        let userId = localStorage.getItem('userId')
        if (!userId) {
          userId = uuidv4()
          localStorage.setItem('userId', userId)
        }
        setUserInfo({
          id: userId,
          email: '',
          groups: [],
          username: '',
        })
        setDone(true)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, code, state])

  const publicInterface = {
    session: sessionInfo,
    user: userInfo,
    logoutAndRedirect,
    loginRedirect,
    refreshSession,
    done,
  }

  if (!done) return <LoadingScreen />

  return (
    <AuthContext.Provider value={publicInterface}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const getAuthHeader = async () => {
  const sessionId = await getSessionId()
  const header = {
    Authorization: `session ${sessionId}`,
  }
  return header
}

export const setSessionId = async (sessionId: string) => {
  await setItem('sessionId', sessionId)
}

export const getSessionId = async () => {
  const sessionId = await getItem('sessionId')
  return sessionId
}

export const removeSessionId = async () => {
  window.localStorage.removeItem('sessionId')
}

export const setOauthState = async (oauthState: string) => {
  await setItem('oauthState', oauthState)
}

export const setStateStore = async (
  state: string,
  store: Record<string, string>
) => {
  await setItem(state, JSON.stringify(store))
}

export const getStateStore = async (state: string) => {
  const store = await getItem(state)
  window.localStorage.removeItem(state)
  return store
}

export const getOauthState = async () => {
  return await getItem('oauthState')
}

export const removeOauthState = async () => {
  window.localStorage.removeItem('oauthState')
}

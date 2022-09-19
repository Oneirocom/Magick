import { useContext, createContext, useState, useEffect } from 'react'
import { Principal } from '@dfinity/principal'

interface PlugContext {
  userPrincipal: string | null
  setUserPrincipal: (principal: string) => void
  login: (
    onSucces?: (arg?: any) => void,
    onFail?: (arg?: any) => void
  ) => Promise<void>
  connected: boolean
  getUserPrincipal: () => Promise<any>
  getAgent: () => any
  getPlug: () => any
}

const Context = createContext<PlugContext>(undefined!)

export const usePlugWallet = () => useContext(Context)

// Might want to namespace these
const PlugProvider = ({ children }) => {
  const [userPrincipal, setUserPrincipalState] = useState<string | null>(null)
  const [connected, setConnected] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const plug = getPlug()
      const hasLoggedIn = await plug?.isConnected()

      if (!hasLoggedIn) return

      login()
    })()
  })

  const setUserPrincipal = principal => {
    setUserPrincipalState(principal)
  }

  const getUserPrincipal = async () => {
    if (!userPrincipal) return null
    const principal = Principal.fromText(userPrincipal)
    return principal
  }

  const getAgent = () => {
    return (window as any)?.ic?.plug.agent
  }

  const getPlug = () => {
    return (window as any)?.ic?.plug
  }

  const login = async (
    onConnect = (arg?: any) => {},
    onFail = (arg?: any) => {}
  ) => {
    const plug = getPlug()
    // check if (window as any).ic exists, and if (window as any).ic.plug exist
    if (!plug) {
      const error = 'Could not connect - Plug is not installed'
      return onFail ? onFail(error) : console.error(error)
    }

    // check if user is logged in
    const hasLoggedIn = await plug.isConnected()
    if (!hasLoggedIn) {
      await plug.requestConnect()
    } else {
      await plug.createAgent()
    }

    // Set connected state for rest of UI
    setConnected(hasLoggedIn)

    // get the users principal that they are logged in as
    const userPrincipalResponse = await (
      window as any
    ).ic.plug.agent.getPrincipal()

    console.log('Logged in as: ' + userPrincipalResponse)

    // call onFail callback
    if (!userPrincipalResponse) {
      const error = 'Could not connect - User authentication failed'
      return onFail ? onFail(error) : console.error(error)
    }

    // Set the users principal to component state for use in UI
    setUserPrincipal(userPrincipalResponse.toString())

    console.log('user principal set', userPrincipalResponse.toString())

    await onConnect(userPrincipalResponse.toString())

    //   activateDabFunctions();
  }

  const publicInterface: PlugContext = {
    userPrincipal,
    setUserPrincipal,
    connected,
    login,
    getUserPrincipal,
    getAgent,
    getPlug,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default PlugProvider

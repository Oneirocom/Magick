import { useAuth, getSessionId } from '@/contexts/AuthProvider'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Icon from '../Icon/Icon'

export function LoginTab({}) {
  const { user } = useAuth()
  const auth = useAuth()
  const [loggedIn, setLoggedIn] = useState(false)
  const [register, setRegister] = useState(false)
  const [showMenu, setShowMenu] = useState<Boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [loginInfo, setLoginInfo] = useState<any>({
    username: '',
    password: '',
  })
  const [registerInfo, setRegisterInfo] = useState<any>({
    email: '',
    username: '',
    password: '',
  })
  const plugLogin = async () => {
    setRegister(false)

    if (
      !loginInfo.username ||
      !loginInfo.password ||
      loginInfo.username?.length <= 0 ||
      loginInfo.password?.length <= 0
    ) {
      return
    }

    const resp = await axios.post(process.env.API_URL + '/login', {
      username: loginInfo.username,
      password: loginInfo.password,
    })

    console.log('logging resp:', resp)

    const temp = loginInfo.username
    loginInfo.username = ''
    loginInfo.password = ''
    if (resp.status === 200) {
      setUsername(temp)
      console.log('setUsername to:', temp, 'username:', username)
      setLoggedIn(true)
      const user_id = resp.data.user_id
      console.log('userId:', user?.id, 'logged in userId:', user_id)
      auth.user = { id: user_id, username: temp, email: '', groups: [] }
    } else {
      console.log(resp.data.error)
    }
  }
  const pluginDisconnect = async () => {
    auth.user = {
      id: await getSessionId(),
      username: '',
      email: '',
      groups: [],
    }
    setUsername('')
    setLoggedIn(false)
    setRegister(false)
  }
  const pluginRegister = async () => {
    if (loggedIn) {
      setRegister(false)
      return
    }

    if (
      !registerInfo.email ||
      !registerInfo.username ||
      !registerInfo.password ||
      registerInfo.email?.length <= 0 ||
      registerInfo.username?.length <= 0 ||
      registerInfo.password?.length <= 0
    ) {
      return
    }

    setUsername('')

    const resp = await axios.post(process.env.API_URL + '/register', {
      email: registerInfo.email,
      username: registerInfo.username,
      password: registerInfo.password,
      user_id: user?.id,
    })

    registerInfo.email = ''
    registerInfo.username = ''
    registerInfo.password = ''
    if (resp.status === 200) {
      setRegister(false)
      setLoggedIn(false)
    } else {
      console.log(resp.data.error)
    }
  }

  // Drops the menu
  const toggleMenu = async () => {
    setShowMenu(!showMenu)
  }

  return (
    <>
      <div className="walletContainer">
        {
          <Icon
            name="account"
            size={24}
            style={{ top: 14 }}
            onClick={toggleMenu}
          />
        }
        <div
          className={'plugSettings' + (showMenu ? ' showMenu' : '')}
          style={{ position: 'absolute', right: 0 }}
        >
          <div className="menuHeader">
            <button onClick={loggedIn ? pluginDisconnect : plugLogin}>
              {loggedIn ? 'Disconnect' : register ? 'Back' : 'Connect'}
            </button>
            {register && !loggedIn ? (
              <div>
                Email:
                <input
                  type="text"
                  defaultValue={registerInfo.email}
                  onChange={e => (registerInfo.email = e.target.value)}
                />
                <br />
                Username:
                <input
                  type="text"
                  defaultValue={registerInfo.username}
                  onChange={e => (registerInfo.username = e.target.value)}
                />
                <br />
                Password:
                <input
                  type="password"
                  defaultValue={registerInfo.password}
                  onChange={e => (registerInfo.password = e.target.value)}
                />
                <br />
                <button onClick={pluginRegister}>Register</button>
              </div>
            ) : (
              <div></div>
            )}
            {register ? (
              <div></div>
            ) : (
              <div>
                {loggedIn ? (
                  <div>
                    <h6>Logged In As {username}</h6>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        if (!loggedIn) {
                          setRegister(true)
                        }
                      }}
                    >
                      Register
                    </button>
                    Username:
                    <input
                      type="text"
                      defaultValue={loginInfo.username}
                      onChange={e => (loginInfo.username = e.target.value)}
                    />
                    <br />
                    Password:
                    <input
                      type="password"
                      defaultValue={loginInfo.password}
                      onChange={e => (loginInfo.password = e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

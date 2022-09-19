import { usePlugWallet } from '@/contexts/PlugProvider'
import { useEffect, useState } from 'react'
import './plugWallet.css'

export function PlugWallet({
  onConnect = (arg: string) => {},
  onFail = (arg: string) => {},
}) {
  const { userPrincipal, connected, login } = usePlugWallet()

  const [showMenu, setShowMenu] = useState<Boolean>(false)
  const [currentBalance, setCurrentBalance] = useState<string>('N/A')
  const [tokenName, setTokenName] = useState<string>('')
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false)

  // handle turning balance loading back off when it is done
  useEffect(() => {
    if (tokenName !== '' && balanceLoading) setBalanceLoading(false)
  }, [tokenName, balanceLoading])

  useEffect(() => {
    if (!connected || !userPrincipal) return

    grabBalance()
  }, [connected, userPrincipal])

  const grabBalance = async () => {
    setBalanceLoading(true)
    const response = await (window as any).ic.plug.requestBalance()
    setCurrentBalance(response[0].amount.toString())
    setTokenName(response[0].name)
  }

  const plugLogin = async () => {
    // const onSuccess = async () => {
    //   await grabBalance()
    // }
    login()

    // Process the users wallet balance to show
  }

  // Drops the menu
  const toggleMenu = async () => {
    setShowMenu(!showMenu)
  }

  return (
    <>
      <div className="walletContainer">
        <button onClick={toggleMenu} className="plugMenu">
          Plug Menu
          <div
            className={'statusBubble' + (connected ? ' connected' : '')}
          ></div>
        </button>
        <div className={'plugSettings' + (showMenu ? ' showMenu' : '')}>
          <div className="menuHeader">
            <button onClick={plugLogin} disabled={!!connected}>
              {connected ? 'Connected' : 'Connect'}
            </button>
            <h6>Logged In As: {userPrincipal}</h6>
            <div className="balance" id="balance">
              <p>Balance: </p>
              <p style={{ color: 'rgba(0,255,0,0.5' }}>
                {balanceLoading
                  ? 'Please Wait...'
                  : `${currentBalance} ${tokenName}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

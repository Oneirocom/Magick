import { styled } from '@mui/material/styles'
import { useFeathers } from '@magickml/providers'
import {
  LinearProgress,
  linearProgressClasses,
  Typography,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import styles from './menu.module.css'
import { useState, useEffect } from 'react'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { PortalSubscriptions } from '@magickml/portal-utils-shared'

export const MPBalanceBar = ({ userData }) => {
  const { client } = useFeathers()

  const [remainingBalance, setRemainingBalance] = useState(0)
  const [magickPowerBalance, setMagickPowerBalance] = useState(0)

  const [isMPVisible, setIsMPVisible] = useState(false)
  const [isWalletVisible, setIsWalletVisible] = useState(false) // State for Wallet tooltip visibility

  const [isMPHovered, setIsMPHovered] = useState(false)
  const [isMPTransitionIn, setIsMPTransitionIn] = useState(false)
  const [isMPTransitionOut, setIsMPTransitionOut] = useState(false)

  const [isWalletHovered, setIsWalletHovered] = useState(false)
  const [isWalletTransitionIn, setIsWalletTransitionIn] = useState(false)
  const [isWalletTransitionOut, setIsWalletTransitionOut] = useState(false)

  const [isTooltipHovered, setIsTooltipHovered] = useState(false)

  const [walletColor, setWalletColor] = useState('')

  const handleWalletMouseEnter = () => {
    setIsWalletHovered(true)
  }

  const handleWalletMouseLeave = () => {
    setIsWalletHovered(false)
  }

  const handleMPMouseEnter = () => {
    setIsMPHovered(true)
  }

  const handleMPMouseLeave = () => {
    setIsMPHovered(false)
  }

  //handle setup
  useEffect(() => {
    if (!userData) return
    if (userData.user) {
      const powerLevel = userData.user.promoCredit
      setMagickPowerBalance(powerLevel)
      const balance = userData.user.balance
      setRemainingBalance(balance)
    }
  }, [userData])

  useEffect(() => {
    if (!client) return

    const handler = data => {
      const newCharge = data.newCharge
      let updatedMagickPowerBalance = magickPowerBalance

      // Deduct from magick power balance until it reaches 0
      if (updatedMagickPowerBalance > 0) {
        updatedMagickPowerBalance -= newCharge
        if (updatedMagickPowerBalance < 0) {
          updatedMagickPowerBalance = 0
        }
        setMagickPowerBalance(updatedMagickPowerBalance)
      }

      // Adjust wallet balance after magick power balance reaches 0
      if (updatedMagickPowerBalance === 0) {
        const newBalance = remainingBalance - newCharge
        const newWalletBalance = newBalance <= 0 ? 0 : newBalance
        setRemainingBalance(newWalletBalance)
      }
    }

    client.service('user').on('budgetUpdated', handler)

    return () => {
      client.service('user').removeListener('budgetUpdated', handler)
    }
  }, [client, magickPowerBalance, remainingBalance])

  useEffect(() => {
    if (isWalletHovered) {
      setIsWalletVisible(true)
      setIsWalletTransitionIn(true)
    } else {
      if (isTooltipHovered) return
      setIsWalletTransitionOut(true)
      const timeoutId = setTimeout(() => {
        setIsWalletVisible(false)
        setIsWalletTransitionIn(false)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [isWalletHovered, isTooltipHovered])

  useEffect(() => {
    if (isMPHovered) {
      setIsMPVisible(true)
      setIsMPTransitionIn(true)
    } else {
      setIsMPTransitionOut(true)
      setTimeout(() => {
        setIsMPVisible(false)
        setIsMPTransitionIn(false)
      }, 500)
    }
  }, [isMPHovered])

  useEffect(() => {
    if (remainingBalance === 0 && magickPowerBalance > 0) {
      setWalletColor('#FFFFFF') // Set to white if wallet balance is 0 and there is remaining Magick Power
    } else if (remainingBalance >= 5) {
      setWalletColor('#00FF85')
    } else if (remainingBalance < 5 && remainingBalance >= 2) {
      setWalletColor('#FFD600')
    } else {
      setWalletColor('#FF0000')
    }
  }, [remainingBalance, magickPowerBalance])

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: magickPowerBalance ? '#117A91' : '#363D44',
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: '#0b0d0e',
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: '#1BC5EB',
    },
  }))

  const isNeophyte =
    userData && userData.user?.subscriptionName === PortalSubscriptions.NEOPHYTE
  const isApprentice =
    userData &&
    userData?.user?.subscriptionName === PortalSubscriptions.APPRENTICE
  const isWizard =
    userData && userData?.user?.subscriptionName === PortalSubscriptions.WIZARD

  const mp = Number((magickPowerBalance * 100).toFixed(0))
  const walletBalance = Number(remainingBalance.toFixed(2))

  const neophyteBody =
    'Your Magick Power (MP) shows how much compute power you have remaining before your free trial is over.'
  const apprenticeBody =
    'Upgrade to Wizard for access to all AI providers and 1000 MP per month.'
  const wizardBody =
    'Your Magick Power (MP) reflects your available compute power, replenished monthly with your Wizard subscription.'
  const body = isNeophyte
    ? neophyteBody
    : isApprentice
    ? apprenticeBody
    : wizardBody

  const walletStyle = {
    color: walletColor,
    transition: 'color 0.5s ease',
  }

  const normalise = (value, MIN, MAX) => ((value - MIN) * 100) / (MAX - MIN)

  return (
    <div className={`${styles.credits} ${isApprentice ? 'opacity-40' : ''}`}>
      <div>
        <div className={styles.menuFlex}>
          <AutoAwesomeIcon sx={{ mr: 1, color: '#B7BBBE' }} />
          <Typography variant="body1" className="text-[#B7BBBE]">
            Magick Power (MP)
          </Typography>
          <InfoOutlinedIcon
            className="text-[#B7BBBE] ml-1"
            style={{
              fontSize: '1rem',
            }}
            onMouseEnter={handleMPMouseEnter}
            onMouseLeave={handleMPMouseLeave}
          />
        </div>
        <BorderLinearProgress
          variant="determinate"
          value={
            isNeophyte
              ? normalise(magickPowerBalance * 100, 0, 200) > 100
                ? 100
                : normalise(magickPowerBalance * 100, 0, 200)
              : normalise(magickPowerBalance * 100, 0, 1000) > 100
              ? 100
              : normalise(magickPowerBalance * 100, 0, 1000)
          }
        />
        <p className={`${styles.creditCount} mt-2 text-[#B7BBBE]`}>
          {isNeophyte && magickPowerBalance === 0
            ? 'Upgrade to use MP'
            : `${mp} / ${isWizard || isApprentice ? '1000' : '200'} monthly MP`}
        </p>
      </div>

      <div className="flex row">
        <p className="text-[#B7BBBE]">
          Wallet:{' '}
          <span className="font-medium" style={walletStyle}>
            ${walletBalance > 0 ? walletBalance : '0.00'}
          </span>
        </p>
        <InfoOutlinedIcon
          className="text-[#B7BBBE] ml-1"
          style={{
            fontSize: '1rem',
          }}
          onMouseEnter={handleWalletMouseEnter}
          onMouseLeave={handleWalletMouseLeave}
        />
      </div>

      <div className={`${isMPVisible ? 'visible' : 'invisible'}`}>
        <div
          className={`
          absolute
          transform
          left-0
          bottom-32
          transition-opacity
          duration-500
          ${isMPTransitionIn ? 'opacity-100' : 'opacity-0'}
          ${isMPTransitionOut ? 'opacity-0' : ''}
          flex
          flex-col
          items-center
          p-4
          border-2
          border-[#1BC5EB]
          rounded-md
          bg-[#171b1c]
        `}
        >
          <h2 className="mb-2">MP Bar</h2>
          <div className="max-w-md text-wrap h-20 mt-2 mb-6">{body}</div>
        </div>
      </div>

      <div
        onMouseEnter={() => setIsTooltipHovered(true)}
        onMouseLeave={() => setIsTooltipHovered(false)}
        className={`${isWalletVisible ? 'visible' : 'invisible'}`}
      >
        <div
          className={`
        absolute
        transform
        left-0
        bottom-11
        transition-opacity
        duration-500
        delay-500
        ${isWalletTransitionIn ? 'opacity-100' : 'opacity-0'}
        ${isWalletTransitionOut ? 'opacity-0' : ''}
        flex
        flex-col
        items-center
        p-4
        border-2
        border-[#1BC5EB]
        rounded-md
        bg-[#171b1c]
      `}
        >
          <h2 className="mb-2">Wallet</h2>
          <div className="max-w-md text-wrap">
            Your Wallet reflects money available for compute power, used after
            your monthly MP runs out.{' '}
            <a
              href="https://cloud-dev.magickml.com/account"
              className="text-blue-500 hover:text-blue-700"
            >
              Click to top up.
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

import { styled } from '@mui/material/styles'
import { useFeathers } from '@magickml/providers'
import { LinearProgress, linearProgressClasses, Typography } from '@mui/material'
import styles from './menu.module.css'
import { useState, useEffect } from 'react'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { SubscriptionNames } from 'servicesShared'

export const MPBalanceBar = ({ userData }) => {
  const { client } = useFeathers()

  const [remainingBalance, setRemainingBalance] = useState(0)
  const [magickPowerBalance, setMagickPowerBalance] = useState(0)

  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitionIn, setIsTransitionIn] = useState(false)
  const [isTransitionOut, setIsTransitionOut] = useState(false)
  const [walletColor, setWalletColor] = useState('');

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

    const handler = (data) => {
      const newCharge = data.newCharge;
      let updatedMagickPowerBalance = magickPowerBalance;

      // Deduct from magick power balance until it reaches 0
      if (updatedMagickPowerBalance > 0) {
        updatedMagickPowerBalance -= newCharge;
        if (updatedMagickPowerBalance < 0) {
          updatedMagickPowerBalance = 0;
        }
        setMagickPowerBalance(updatedMagickPowerBalance);
      }

      // Adjust wallet balance after magick power balance reaches 0
      if (updatedMagickPowerBalance === 0) {
        const newBalance = remainingBalance - newCharge;
        const newWalletBalance = newBalance <= 0 ? 0 : newBalance;
        setRemainingBalance(newWalletBalance);
      }
    }

    client.service('user').on('budgetUpdated', handler)

    return () => {
      client.service('user').removeListener('budgetUpdated', handler)
    }
  }, [client, magickPowerBalance, remainingBalance])

  useEffect(() => {
    if (isHovered && !isVisible) {
      setIsTransitionIn(true);
      setIsVisible(true);
    } else if (!isHovered && isVisible) {
      setIsTransitionOut(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsTransitionOut(false); // Reset transition state after fade out
      }, 1000);
    }
  }, [isHovered, isVisible]);

  useEffect(() => {
    if (remainingBalance >= 5) {
      setWalletColor('#00FF85');
    } else if (remainingBalance < 5 && remainingBalance >= 2) {
      setWalletColor('#FFD600');
    } else {
      setWalletColor('#FF0000');
    }
  }, [remainingBalance]);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: magickPowerBalance ? "#117A91" : "#363D44",
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#0b0d0e",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: '#1BC5EB',
    },
  }))

  const hasSubscription = userData && userData?.user?.hasSubscription
  const isNeophyte = userData && !hasSubscription
  const isApprentice = userData && userData?.user?.subscriptionName === SubscriptionNames.Apprentice
  const isWizard = userData && userData?.user?.subscriptionName === SubscriptionNames.Wizard

  const mp = Number((magickPowerBalance * 100).toFixed(0))
  const walletBalance = Number((remainingBalance).toFixed(2))

  const neophyteBody = 'Your Magick Power (MP) shows how much compute power you have remaining before your free trial is over.'
  const apprenticeBody = 'Upgrade to Wizard for access to all AI providers and 1000 MP per month.'
  const wizardBody = 'Your Magick Power (MP) reflects your available compute power, replenished monthly with your Wizard subscription.'
  const body = isNeophyte ? neophyteBody : isApprentice ? apprenticeBody : wizardBody

  const walletStyle = {
    color: walletColor,
    transition: 'color 0.5s ease',
  };

  return (
    <div className={`${styles.credits} ${isApprentice ? 'opacity-40' : ''}`}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }
      }
    >
      <div className={styles.menuFlex}>
        <AutoAwesomeIcon sx={{ mr: 1 }} />
        <Typography variant="body1">Magick Power (MP)</Typography>
      </div>
      <BorderLinearProgress variant="determinate" value={magickPowerBalance * 10} />
      <p className={`${styles.creditCount} mt-2 `}>
        {isNeophyte ? 'Upgrade to user MP' : `${mp} / ${isWizard || isApprentice ? '1000' : '200'} monthly MP`}
      </p >
      <p>
        Wallet: <span className='font-medium' style={walletStyle}>${walletBalance}</span>
      </p>
      <div className={`${isVisible ? 'visible' : 'invisible'}`}>
        <div className={`
          absolute
          transform
          left-0
          bottom-2
          transition-opacity
          duration-500
          ${isTransitionIn ? 'opacity-100' : 'opacity-0'}
          ${isTransitionOut ? 'opacity-0' : ''}
          flex
          flex-col
          items-center
          p-4 border-2
          border-[#1BC5EB]
          rounded-md bg-[#171b1c]
        `
        }>

          <h2 className='mb-2'>mp bar</h2>
          <div className="max-w-md text-wrap h-20 mt-2 mb-6">
            {body}
          </div>
        </div>
      </div>
    </div >
  )
}

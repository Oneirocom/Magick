import { useFeathers } from '@magickml/providers'
import {
  Progress,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@magickml/client-ui'
import Image from 'next/legacy/image'

import { InfoIcon } from '@magickml/icons'
import { useState, useEffect } from 'react'

export const MPBalanceBar = ({ userData, isLoading }) => {
  const { client } = useFeathers()

  const [remainingBalance, setRemainingBalance] = useState(0)
  const [magickPowerBalance, setMagickPowerBalance] = useState(0)
  const [walletColor, setWalletColor] = useState('')

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
    if (isLoading) return
    if (remainingBalance === 0 && magickPowerBalance > 0) {
      setWalletColor('#FFFFFF') // Set to white if wallet balance is 0 and there is remaining Magick Power
    } else if (remainingBalance >= 5) {
      setWalletColor('#00FF85')
    } else if (remainingBalance < 5 && remainingBalance >= 2) {
      setWalletColor('#FFD600')
    } else {
      setWalletColor('#FF0000')
    }
  }, [remainingBalance, magickPowerBalance, isLoading])

  // const isAspirant = userData && userData.user?.subscriptionName === 'ASPIRANT'
  // const isApprentice =
  //   userData && userData?.user?.subscriptionName === 'APPRENTICE'
  const isWizard = userData && userData?.user?.subscriptionName === 'WIZARD'

  const getCurrentMP = () => {
    return Number((magickPowerBalance || 0).toFixed(2) || 0) * 100
  }

  const getProgressValue = () => {
    console.log('magickPowerBalance', magickPowerBalance)
    const maxMP = isWizard ? 1000 : 200 // Maximum MP based on subscription
    const currentMP = getCurrentMP() // Get current MP
    const percentage = (currentMP / maxMP) * 100 // Calculate percentage of the max MP

    if (isNaN(percentage) || percentage < 0) return 0 // Ensure value is not NaN or negative
    return percentage > 100 ? 100 : percentage // Cap the value at 100%
  }

  const getWalletBalanceDisplay = () => {
    // Check if the user is currently a wizard
    if (isWizard) {
      // If they have a balance, display it; otherwise, show zero
      return `$${Number(remainingBalance || 0).toFixed(2)}`
    } else {
      // For non-wizard users, show the balance if it exists and is greater than 0,
      // otherwise show 'N/A'
      return Number(remainingBalance || 0) > 0
        ? `$${Number(remainingBalance || 0).toFixed(2)}`
        : 'N/A'
    }
  }

  return (
    <div className="w-full h-full flex flex-col px-5 box-border items-start justify-end gap-[5px]">
      <div className="self-stretch bg-[#282d33] text-[#b5b9bc] rounded-md py-1 px-3">
        <div className="flex flex-row py-[5px] items-center justify-start gap-1">
          <Image
            className="relative overflow-hidden flex-shrink-0 object-cover justify-end w-full"
            alt="Magic Points Icon"
            src="/images/icons/mp.svg"
            width={15}
            height={15}
          />
          <div className="text-md font-medium font-montAlt">
            Magick Power (MP)
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute inline-flex items-center justify-center font-medium cursor-pointer right-7 opacity-50">
                  <InfoIcon />
                </div>
              </TooltipTrigger>
              <TooltipContent className="">
                <h3 className="text-lg font-semibold prose-h3:prose-sm">
                  Magick Power (MP)
                </h3>
                <p className="prose-p:prose-sm py-1">
                  Magick Power (MP) is your monthly balance from your
                  subscription.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="self-stretch relative py-1">
          <div className="-top-1 -left-1 absolute rounded-[20px] w-full h-5" />

          <Progress value={getProgressValue()} />

          {/* MP Info container */}
          <div className="relative w-full text-center mt-2 flex">
            <p className="text-ds-secondary-p dark:text-ds-secondary-m font-normal text-xs justify-start">
              {`${getCurrentMP()} / ${isWizard ? '1000' : '200 Free Trial'} MP`}
            </p>
          </div>
        </div>
      </div>
      <div className="relative w-full rounded-md bg-[#282d33] text-[#b5b9bc] border-1 border-black px-3 pt-2 pb-1 my-2">
        <p
          className={`text-ds-secondary-p dark:text-ds-secondary-m text-lg font-medium text-${walletColor} ${
            isWizard ? 'opacity-1' : 'opacity-25'
          }`}
        >
          Wallet: {getWalletBalanceDisplay()}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute inline-flex items-center justify-center font-medium cursor-pointer right-0 top-1/2 transform -translate-y-1/2">
                <InfoIcon className={`opacity-50 mr-2 mb-1`} />
              </div>
            </TooltipTrigger>

            <TooltipContent className="">
              <h3 className="text-lg font-semibold prose-h3:prose-sm">
                Wallet
              </h3>
              <p className="prose-p:prose-sm py-1">
                Money available for compute power. Accessible with a Wizard
                subscription.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

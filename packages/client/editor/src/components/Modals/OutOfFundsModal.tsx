import { useUser } from '@clerk/nextjs'
import Modal from '../Modal/NewModal'
import { PORTAL_URL } from 'clientConfig'
import Treasure from './treasure.png'

const OutOfFundsModal = () => {
  const user = useUser()
  const subscription = user.user?.publicMetadata.subscription as
    | string
    | undefined

  const isWizard = subscription?.toUpperCase() === 'WIZARD'
  const isFreeUser = subscription?.toUpperCase() === 'NEOPHYTE'

  const publicMetadata = user.user?.publicMetadata

  const { mpRenewsAt } = publicMetadata || {}

  // Create a new Date object from the ISO string
  const date = new Date(mpRenewsAt as string)

  // Format the date using the defined options
  const readableDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }).format(date)

  const hasSubscriptionNeedsBalanceCopy = `Oops! It looks like you've run out of MP and money in your wallet. To
  continue running your agent please add funds to your wallet. ${
    isWizard && `Your MP will refill on ${readableDate}.`
  }`

  const freeTrialExpiredCopy = `Oops! It looks like you've run out of your free trial MP. To continue running your agent subscribe now.`

  const options = [
    {
      label: isWizard ? 'Add Funds' : 'Subscribe Now',
      onClick: () => {
        isWizard
          ? window.open(
              `${PORTAL_URL || 'https://beta.magickml.com'}/billing`,
              '_blank'
            )
          : window.open(
              `${PORTAL_URL || 'https://beta.magickml.com'}/subscribe`,
              '_blank'
            )
      },
      className:
        'bg-[#04c9f0] text-[#0b0d0e] px-4 py-2 w-[180px] rounded font-semibold hover:bg-blue-600 transition duration-300',
    },
  ]

  return (
    <Modal
      title={`${isWizard ? 'MP and Wallet Empty' : 'Free-Trial MP Expired'}`}
      options={options}
      className="w-full max-w-md "
      imagePath={Treasure}
    >
      <div className=" flex row ">
        <div className="flex items-center justify-center mb-4">
          <p className="mb-4 text-lg">
            {isFreeUser
              ? freeTrialExpiredCopy
              : hasSubscriptionNeedsBalanceCopy}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default OutOfFundsModal

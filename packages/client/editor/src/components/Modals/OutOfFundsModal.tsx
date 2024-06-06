import { useUser } from '@clerk/nextjs'
import Modal from '../Modal/Modal'
import { PORTAL_URL } from 'clientConfig'

const OutOfFundsModal = () => {
  const user = useUser()
  const subscription = user.user?.publicMetadata.subscription as
    | string
    | undefined

  const isWizard = subscription?.toUpperCase() === 'WIZARD'
  const isFreeUser = subscription?.toUpperCase() === 'NEOPHYTE'

  const publicMetadata = user.user?.publicMetadata

  const { mpRenewsAt } = publicMetadata || {}

  const hasSubscriptionNeedsBalanceCopy = `Oops! It looks like you've run out of MP and money in your wallet. To
  continue running your agent please add funds to your wallet. ${
    isWizard && `Your MP will refill on ${mpRenewsAt}.`
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
        'bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition duration-300',
    },
  ]

  return (
    <Modal
      title={`${isWizard ? 'MP and Wallet Empty' : ''}`}
      options={options}
      className="w-full max-w-md"
    >
      <div className="p-6">
        <p className="mb-4 text-lg">
          {isFreeUser ? freeTrialExpiredCopy : hasSubscriptionNeedsBalanceCopy}
        </p>
        <p className="text-lg">
          By subscribing, you'll gain access to additional features and
          resources that will enhance your experience with Magick.
        </p>
      </div>
    </Modal>
  )
}

export default OutOfFundsModal

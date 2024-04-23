import { Button } from '@magickml/client-ui'

const SeraphTopBar = ({
  clearHistory,
  requestError,
  resubmitRequest,
}: {
  clearHistory: () => void
  requestError: boolean
  resubmitRequest: () => void
}) => {
  return (
    <div className="flex justify-end m-2 border-b border-gray-800">
      <div className="flex gap-4">
        {requestError && (
          <Button onClick={resubmitRequest}>Resubmit Request</Button>
        )}
        <Button onClick={clearHistory}>Clear Chat</Button>
      </div>
    </div>
  )
}

export default SeraphTopBar

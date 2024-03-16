import { useSelector } from 'react-redux'
import ChatWindow from '../ChatWindow/ChatWindow'
import { RootState } from 'client/state'

const SerifWindow = ({ spellName }: { spellName: string }) => {
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)

  return (
    <div className="flex flex-col h-full p-4 text-white">
      <ChatWindow tab={currentTab} spellName={spellName} />
    </div>
  )
}

export default SerifWindow

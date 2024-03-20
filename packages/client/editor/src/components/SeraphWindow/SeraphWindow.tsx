import { useSelector } from 'react-redux'
import ChatWindow from '../ChatWindow/ChatWindow'
import { RootState } from 'client/state'

const SeraphWindow = ({ spellName }: { spellName: string }) => {
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  //TOOD: something to improve here

  if (!currentTab) return null
  return (
    <div className="flex flex-col h-full p-4 text-white">
      <ChatWindow tab={currentTab} spellName={spellName} />
    </div>
  )
}

export default SeraphWindow

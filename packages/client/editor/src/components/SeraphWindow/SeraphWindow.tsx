import { useSelector } from 'react-redux'
import { RootState } from 'client/state'
import SeraphChatWindow from './SeraphChatWindow'

const SeraphWindow = ({ spellName }: { spellName: string }) => {
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  //TOOD: something to improve here

  if (!currentTab) return null
  return (
    <div className="flex flex-col h-full text-white bg-[--ds-black]">
      <SeraphChatWindow tab={currentTab} spellName={spellName} />
    </div>
  )
}

export default SeraphWindow

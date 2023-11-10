import { Close, Done } from "@mui/icons-material"
import { IconBtn } from "client/core"

export const InputEdit = ({
  selectedAgentData,
  setSelectedAgentData,
  update,
  setEditMode,
  setOldName,
  oldName
}) => {
  return (<>
    <input
      type="text"
      name="name"
      value={selectedAgentData.name}
      onChange={e =>
        setSelectedAgentData({
          ...selectedAgentData,
          name: e.target.value,
        })
      }
      placeholder="Add new agent name here"
      onKeyDown={e => {
        if (e.key === 'Enter') {
          update(selectedAgentData.id)
          setEditMode(false)
          setOldName('')
        }
      }}
    />
    <IconBtn
      label={'Done'}
      Icon={<Done />}
      onClick={e => {
        update(selectedAgentData.id)
        setEditMode(false)
        setOldName('')
      }}
    />
    <IconBtn
      label={'close'}
      Icon={<Close />}
      onClick={e => {
        setSelectedAgentData({ ...selectedAgentData, name: oldName })
        setOldName('')
        setEditMode(false)
      }}
    />
  </>)
}
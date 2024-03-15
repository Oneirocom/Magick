import { useUpdateAgentMutation } from 'client/state'
import { ConfigHeader } from './config-header'

interface AgentDetailsProps {
  selectedAgentData: any
  setSelectedAgentData?: (data: any) => void
}

export const AgentDetails = ({
  selectedAgentData,
  setSelectedAgentData,
}: AgentDetailsProps) => {
  const [updateAgent] = useUpdateAgentMutation()
  const update = (data = {}) => {
    const _data = { ...selectedAgentData, ...data }
    _data.enabled = !!_data.enabled
    _data.updatedAt = new Date().toISOString()
    _data.secrets = _data.secrets || '{}'
    _data.pingedAt = new Date().toISOString()

    updateAgent(_data)
      .unwrap()
      .then(data => {
        setSelectedAgentData && setSelectedAgentData(data)
      })
      .catch(console.error)
  }

  if (!selectedAgentData) return null

  return (
    <ConfigHeader
      selectedAgentData={selectedAgentData}
      setSelectedAgentData={setSelectedAgentData}
      update={update}
    />
  )
}

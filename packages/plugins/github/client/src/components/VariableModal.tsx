import { Modal } from 'client/core'
import { useState } from 'react'
import { Tooltip } from "@mui/material"

const VariableModal = ({
  selectedAgentData,
  editMode,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    github_access_token: selectedAgentData?.data?.github_access_token,
    github_repos: selectedAgentData?.data?.github_repos,
  })

  const handleSave = async () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...{
          ...state,
        },
      },
    }
    let json = {}
    const secrets = localStorage.getItem('secrets')
    if (secrets) {
      const parsedSecrets = JSON.parse(secrets)
      json = { ...parsedSecrets }
    }
    json['github_access_token'] = state.github_access_token
    json['github_repos'] = state.github_repos
    localStorage.setItem('secrets', JSON.stringify(json))

    update(selectedAgentData.id, data)
  }

  const handleAccessToken = async e => {
    const access_token = e.target.value.trim()

    setState({
      ...state,
      github_access_token: access_token,
    })
  }

  const handleChange = async e => {
    const repoInfos = e.target.value.split(',')

    setState({
      ...state,
      github_repos: repoInfos,
    })
  }

  return (
    editMode && (
      <Modal
        open={editMode}
        onClose={setEditMode}
        handleAction={handleSave}
        showSaveBtn={true}
      >
        <>
          <div style={{ marginBottom: '1em' }}>
            <Tooltip title={" Add your Github access "} placement="bottom" disableInteractive arrow>
              <span className="form-item-label">Personal Access Token</span>
            </Tooltip>
            <input
              type="text"
              className="text-input modal-element"
              name="github_access_token"
              id="github_access_token"
              value={state.github_access_token}
              onChange={handleAccessToken}
            />
          </div>
          <div style={{ marginBottom: '1em' }}>
            <Tooltip title={" Add your Github repositories "} placement="bottom" disableInteractive arrow>
              <span className="form-item-label">Repositories (Comma separated, i.e. org/repo, org/repo)</span>
            </Tooltip>
            <input
              type="text"
              className="text-input modal-element"
              name="github_repository"
              id="github_repository"
              value={state.github_repos}
              onChange={handleChange}
            />
          </div>
        </>
      </Modal>
    )
  )
}

export default VariableModal

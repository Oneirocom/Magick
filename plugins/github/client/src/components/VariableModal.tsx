import { Modal } from '@magickml/client-core'
import axios from 'axios'
import { GithubConnector } from '../GithubConnector'
import { useState } from 'react'
import LoginGithub from 'react-github-custom-login'

import { API_ROOT_URL } from '@magickml/core'
const CLIENT_ID = "d79801d2614ccec5a2ab"

const VariableModal = ({
  selectedAgentData,
  editMode,
  setEditMode,
  update,
}) => {
  const [state, setState] = useState({
    github_access_token: selectedAgentData?.data?.github_access_token,
    github_token: selectedAgentData?.data?.github_token,
    github_repos: selectedAgentData?.data?.github_repos,
    github_login: selectedAgentData?.data?.github_login ?? false,
    github_repo_owner: selectedAgentData?.data?.github_repo_owner,
    github_repo_name: selectedAgentData?.data?.github_repo_name,
  })
  const [localRepoInfo, setLocalRepoInfo] = useState(
    selectedAgentData?.data?.github_repo_owner + ' ' + selectedAgentData?.data?.github_repo_name
  )

  const handleSave = async () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...state,
      },
    }
    let json = {}
    const secrets = localStorage.getItem('secrets')
    if (secrets) {
      let parsedSecrets = JSON.parse(secrets)
      json = { ...parsedSecrets }
    }
    json['github_access_token'] = state.github_access_token
    localStorage.setItem('secrets', JSON.stringify(json))

    console.log(JSON.stringify(selectedAgentData))
    update(selectedAgentData.id, data)

    console.log(state.github_repo_name)
  }

  const handleChange = async (e) => {
    const repoInfos = e.target.value.split(' ')
    setLocalRepoInfo(e.target.value)

    setState({
      ...state,
      github_repo_owner: repoInfos[0],
      github_repo_name: repoInfos[1]
    })
  }

  const onSuccess = async response => {

    await axios.get(`${API_ROOT_URL}/gettokenuser`, {
      params: {
        code: response.code
      },
    }).then(async response => {
      let suffix = ''
      for (let i = 0; i < response.data.length - 7; i++) {
        suffix += '*'
      }

      const token = response.data.substring(7, 0) + suffix

      const repos = await new GithubConnector().getGitHubRepos(response.data)

      setState({
        ...state,
        github_login: true,
        github_access_token: response.data,
        github_token: token,
        github_repos: repos,
      })

      console.log(JSON.stringify(state))
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    editMode && (
      <Modal open={editMode} onClose={setEditMode} handleAction={handleSave} showSaveBtn={state.github_login}>
        {
          !state.github_login ? (
            <LoginGithub clientId={CLIENT_ID} scope="user:email,repo" onSuccess={onSuccess} buttonText="Login Github" />
          ) : (
            <>
              <div style={{ marginBottom: '1em' }}>
                <div>
                  <span className="form-item-label">Access Token: {state.github_token}</span>
                </div>
              </div>
              <div style={{ marginBottom: '1em' }}>
                <span className="form-item-label">Repositories:</span>
                <select
                  className="select modal-element"
                  name="github_repository"
                  id="github_repository"
                  value={localRepoInfo}
                  onChange={handleChange}
                >
                  {state.github_repos?.map(item => {
                    return (
                      <option value={item.owner.login + ' ' + item.name} key={item.id}>
                        {item?.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </>
          )
        }

      </Modal>
    )
  )
}

export default VariableModal


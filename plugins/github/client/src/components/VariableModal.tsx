import { Modal } from '@magickml/client-core'
import axios from 'axios'
import { GithubConnector } from '../GithubConnector'
import { useState } from 'react'
import LoginGithub from 'react-github-custom-login'

import { API_ROOT_URL } from '@magickml/core'

const CLINET_ID = ""
const CLIENT_SECRET = ""

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

  const [localClientId, setLocalClientId] = useState(
    selectedAgentData?.data?.github_client_id ?? CLINET_ID
  )
  const [localClientSecret, setLocalClientSecret] = useState(
    selectedAgentData?.data?.github_client_secret ?? CLIENT_SECRET
  )
  const [localWebhooksSecret, setLocalWebhooksSecret] = useState(
    selectedAgentData?.data?.github_webhooks_secret ?? ""
  )

  const handleSave = async () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...{
          ...state,
          github_webhooks_secret: localWebhooksSecret
        },
      },
    }
    let json = {}
    const secrets = localStorage.getItem('secrets')
    if (secrets) {
      let parsedSecrets = JSON.parse(secrets)
      json = { ...parsedSecrets }
    }
    json['github_access_token'] = state.github_access_token
    json['github_repo_owner'] = state.github_repo_owner
    json['github_repo_name'] = state.github_repo_name
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
        code: response.code,
        github_client_id: localClientId,
        github_client_secret: localClientSecret
      },
    }).then(async response => {

      const data = {
        ...selectedAgentData,
        data: {
          ...selectedAgentData.data,
          ...{
            github_client_id: localClientId,
            github_client_secret: localClientSecret
          },
        },
      }

      console.log(JSON.stringify(selectedAgentData))
      update(selectedAgentData.id, data)

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
            <>
              <p style={{ marginTop: '1em' }} className="modal-element">
                To get repositories, you will need to set up an
                <a href="https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app">OauthApp</a>.
              </p>
              <div style={{ marginBottom: '1em' }}>
                <span className="form-item-label">Github Client Id</span>
                <input
                  className="modal-element"
                  type="text"
                  name="github_client_id"
                  value={localClientId}
                  onChange={e => setLocalClientId(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1em' }}>
                <span className="form-item-label">Github Client Secret</span>
                <input
                  className="modal-element"
                  type="text"
                  name="github_client_secret"
                  value={localClientSecret}
                  onChange={e => setLocalClientSecret(e.target.value)}
                />
              </div>

              <LoginGithub
                clientId={localClientId}
                scope="user:email,repo"
                onSuccess={onSuccess}
                buttonText="Login Github"
              />
            </>
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
              <p style={{ marginTop: '1em' }} className="modal-element">
                To listen events, you will need to set up
                <a href="https://docs.github.com/en/webhooks-and-events/webhooks/creating-webhooks">Webhook Secret</a>.
              </p>
              <div style={{ marginBottom: '1em' }}>
                <span className="form-item-label">Webhook Secret</span>
                <input
                  className="modal-element"
                  type="text"
                  name="github_webhooks_secret"
                  value={localWebhooksSecret}
                  onChange={e => setLocalWebhooksSecret(e.target.value)}
                />
              </div>
            </>
          )
        }

      </Modal>
    )
  )
}

export default VariableModal


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
    github_repo_flag: selectedAgentData?.data?.github_repo_flag,
    github_login: selectedAgentData?.data?.github_login,
  })
  const [ buttonState, setButtonState ] = useState(Boolean<false>)

  const updateState = (name, value) => {
    setState({ ...state, [name]: value })
  }
  
  const handleSave = async () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data,
        ...state,
      },
    }
    console.log(JSON.stringify(selectedAgentData))
    update(selectedAgentData.id, data)
  }

  const onSuccess = async response => {
    
    await axios.get(`${API_ROOT_URL}/gettokenuser`, {
      params: {
        code: response.code
      },
    }).then(async response => {
      let suffix = ''
      for(let i = 0 ; i< response.data.length-7 ; i++){
        suffix += '*'
      }

      setButtonState(true)
      
      const token = response.data.substring(7, 0) + suffix
      
      const repos = await new GithubConnector().getGitHubRepos(response.data)

      setState({
        github_login: true,
        github_repo_flag: true,
        github_access_token: response.data,
        github_token: token,
        github_repos: repos
      })
      
      console.log(JSON.stringify(state))
    })
    .catch( err=> {
      console.log(err)
    })    
  }

  return (
    editMode && (
      <Modal open={editMode} onClose={setEditMode} handleAction={handleSave} showSaveBtn={buttonState}>
        {
          !state.github_login &&
          (
            <LoginGithub clientId={CLIENT_ID} scope="user:email,repo" onSuccess={onSuccess} buttonText="Login Github"></LoginGithub>
          )
        }
        {
          state.github_repo_flag &&
          (
            <>
              <div style={{ marginBottom: '1em' }}>
                <div>
                  <span className="form-item-label">Access Token: {state.github_token}</span>
                </div>
              </div>
              <div style={{ marginBottom: '1em' }}>
                <span className="form-item-label">Repositories:</span>
                <select className="select modal-element" name="github_repository" id="github_repository">
                  {state.github_repos?.map(item => <option value={item.owner.login + ' ' + item.name} key={item.id}>{item?.name}</option>)}
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


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
  const [ token, setToken ] = useState('')
  const [ repos, setrepos ] = useState(Array<any>)
  const [ repoInfo, setrepoInfo ] = useState(Boolean<false>)
  const [ loginState, setloginState ] = useState(Boolean<false>)
  const [ buttonState, setbuttonState ] = useState(Boolean<false>)

  const handleSave = async () => {
    const data = {
      ...selectedAgentData,
      data: {
        ...selectedAgentData.data
      },
    }
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
      setloginState(true)
      setbuttonState(true)
      setrepoInfo(true)
      const ctoken = response.data.substring(7, 0) + suffix
      setToken(ctoken)

      setrepos(await new GithubConnector().getGitHubRepos(response.data))
      
    })
    .catch( err=> {
      console.log(err)
    } )
    
  }

  return (
    editMode && (
      <Modal open={editMode} onClose={setEditMode} handleAction={handleSave} showSaveBtn={buttonState}>
        {
          !loginState &&
          (
            <LoginGithub clientId={CLIENT_ID} scope="user:email,repo" onSuccess={onSuccess} buttonText="Login Github"></LoginGithub>
          )
        }
        {
          repoInfo &&
          (
            <>
              <div style={{ marginBottom: '1em' }}>
                <div>
                  <span className="form-item-label">Access Token:{token}</span>
                </div>
              </div>
              <div style={{ marginBottom: '1em' }}>
                <span className="form-item-label">Repositories:</span>
                <select className="select modal-element" name="github_repository" id="github_repository">
                  {repos?.map(item => <option value={item.owner.login + ' ' + item.name} key={item.id}>{item?.name}</option>)}
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


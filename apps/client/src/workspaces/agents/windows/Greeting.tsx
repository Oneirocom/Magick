// @ts-nocheck
import { useDeleteGreetingMutation, useUpdateGreetingMutation } from "@/state/api/greetings"
import { useSnackbar } from "notistack"
import { useState } from "react"

const Greeting = ({ greeting, updateCallback }) => {
  const [data, setData] = useState(greeting)
  const { enqueueSnackbar } = useSnackbar()
  const [ updateGreeting ] = useUpdateGreetingMutation()
  const [ deleteGreeting ] = useDeleteGreetingMutation()

  const handleChange = (key: string, value: string | boolean) => {
    setData({
      ...data,
      [key]: value
    })
  }

  const _updateGreeting = async () => {
    const { id, ...reqBody } = data
    try {
      await updateGreeting({ id, data: reqBody })
      enqueueSnackbar('Greeting with id: ' + id + ' updated successfully', {
        variant: 'success',
      })
    } catch (e) {
      enqueueSnackbar('Server Error updating entity with id: ' + id, {
        variant: 'error',
      })
    }
  }

  const _deleteGreeting = async () => {
    try {
      await deleteGreeting(data.id)
      enqueueSnackbar('Greeting with id: ' + data.id + ' deleted successfully', {
        variant: 'success',
      })
    } catch (e) {
      enqueueSnackbar('Server Error deleting entity with id: ' + data.id, {
        variant: 'error',
      })
    }
  }

  return (
    <div>
      <div className="form-item">
        <span className="form-item-label">Enabled</span>
        <input
          type="checkbox"
          defaultChecked={data.enabled}
          onChange={(e) => handleChange('enabled', e.target.checked)}
        />
      </div>

      <div className="form-item agent-select">
        <span className="form-item-label">Send Greeting In</span>
        <select 
          name="sendIn" 
          id="sendIn"
          value={data.sendIn}
          onChange={(e) => handleChange('sendIn', e.target.value)}
        >
          <option defaultValue hidden></option>
          <option value='dm'>DM</option>
          <option value='channel'>Channel</option>
        </select>
      </div>

      <div className="form-item">
        <span className="form-item-label">Channel ID</span>
        <input 
          type="text"
          value={data.channelId}
          onChange={(e) => handleChange('channelId', e.target.value)}
        />
      </div>
      
      <div className="form-item">
        <span className="form-item-label">Message</span>
        <textarea
          className="form-text-area" 
          rows={1}
          value={data.message}
          onChange={(e) => handleChange('message', e.target.value)}
        />
      </div>

      <div className="form-item entBtns">
        <button onClick={_updateGreeting} style={{ marginRight: '10px' }}>
          Update
        </button>
        <button onClick={_deleteGreeting} style={{ marginRight: '10px' }}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default Greeting
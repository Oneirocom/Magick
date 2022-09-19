import { useAuth } from '@/contexts/AuthProvider'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

const MessageReaction = ({ message_reaction, updateCallback }) => {
  const [data, setData] = useState(message_reaction)
  const [spellList, setSpellList] = useState('')
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const handleChange = (key: string, value: string) => {
    setData({
      ...data,
      [key]: value,
    })
  }

  useEffect(() => {
    ;(async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_ROOT_URL}/game/spells?userId=${user?.id}`
      )
      setSpellList(res.data)
    })()
  }, [])

  const updateMessageReaction = async () => {
    const { id, ...reqBody } = data
    try {
      await axios.put(
        `${process.env.REACT_APP_API_ROOT_URL}/message_reaction/${id}`,
        {
          ...reqBody,
        }
      )
      enqueueSnackbar(
        'Message Reaction with id: ' + id + ' updated successfully',
        {
          variant: 'success',
        }
      )
      updateCallback()
    } catch (e) {
      enqueueSnackbar('Server Error updating Message Reaction with id: ' + id, {
        variant: 'error',
      })
    }
  }

  const removeMessageReaction = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_ROOT_URL}/message_reaction/${data.id}`
      )
      enqueueSnackbar(
        'Message Reaction with id: ' + data.id + ' deleted successfully',
        {
          variant: 'success',
        }
      )
      updateCallback()
    } catch (e) {
      enqueueSnackbar(
        'Server Error deleting Message Reaction with id: ' + data.id,
        {
          variant: 'error',
        }
      )
    }
  }

  return (
    <div>
      <div className="form-item">
        <span className="form-item-label">Reaction</span>
        <input
          type="text"
          value={data.reaction}
          onChange={e => handleChange('reaction', e.target.value)}
        />
      </div>

      <div className="form-item">
        <span className="form-item-label">Clients</span>
        <label>
          <input
            type="checkbox"
            checked={data.discord_enabled === 'true'}
            onChange={e =>
              handleChange('discord_enabled', e.target.checked + '')
            }
          />
          Discord
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={data.slack_enabled === 'true'}
            onChange={e => handleChange('slack_enabled', e.target.checked + '')}
          />
          Slack
        </label>
      </div>

      <div className="form-item agent-select">
        <span className="form-item-label">Spell Handler</span>
        <select
          name="spellHandlerIncoming"
          id="spellHandlerIncoming"
          value={data.spell_handler}
          onChange={event => {
            handleChange('spell_handler', event.target.value)
          }}
        >
          {spellList.length > 0 &&
            (spellList as any).map((spell, idx) => (
              <option value={spell.name} key={idx}>
                {spell.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-item entBtns">
        <button onClick={updateMessageReaction} style={{ marginRight: '10px' }}>
          Update
        </button>
        <button onClick={removeMessageReaction} style={{ marginRight: '10px' }}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default MessageReaction

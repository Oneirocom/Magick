import { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  createConfig,
  SingleConfig,
  updateConfig,
} from '../../state/admin/config/configState'

const Config = ({ closeModal, name, id, modal }) => {
  const dispatch = useAppDispatch()
  const [response, setResponse] = useState<string>('')
  const { sconfig, loading, error, createSuccess, updateSuccess } =
    useAppSelector(state => state.config)
  const [formData, setFormData] = useState({
    key: '',
    value: '',
  })

  // const { handleSubmit } = useForm()

  useEffect(() => {
    setResponse('')
    if (name === 'Edit') {
      dispatch(SingleConfig(id))
    }
  }, [])

  const onSubmit = async () => {
    if (name === 'Edit') {
      const data = { id, formData }
      dispatch(updateConfig(data))
    } else {
      dispatch(createConfig(formData))
    }
  }

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: loading ? 'loading....' : 'save',
      onClick: onSubmit,
    },
  ]

  useEffect(() => {
    if (error) {
      setResponse(error)
    } else {
      setResponse('')
    }
    if (createSuccess || updateSuccess) {
      setResponse('')
      closeModal()
    }
  }, [error, createSuccess, updateSuccess])

  useEffect(() => {
    if (name === 'Edit' && sconfig.payload[0]) {
      setFormData({
        key: sconfig.payload[0].key,
        value: sconfig.payload[0].value,
      })
    }
  }, [modal, sconfig.payload[0]])

  return (
    <Modal title={`${name} Configuration`} options={options} icon="info">
      <div className={css['login-container']}>
        {response && <span className={css['error-message']}>{response}</span>}
        <form>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Key
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.key}
              onChange={e => setFormData({ ...formData, key: e.target.value })}
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Value
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.value}
              onChange={e =>
                setFormData({ ...formData, value: e.target.value })
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default Config

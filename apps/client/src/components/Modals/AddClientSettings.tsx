import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  createClient,
  singleClient,
  updateClient,
} from '../../state/admin/clientS/clientState'

const AddClientSettings = ({ closeModal, name, id }) => {
  const { sclient, loading, error, createSuccess, updateSuccess } =
    useAppSelector(state => state.client)
  const dispatch = useAppDispatch()
  const [erro, setError] = useState('')
  const [formData, setFormData] = useState({
    client: '',
    name: '',
    type: '',
    defaultValue: '',
  })

  const {
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async () => {
    if (name === 'Edit') {
      const data = { id, formData }
      dispatch(updateClient(data))
    } else {
      dispatch(createClient(formData))
    }
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: loading ? 'loading....' : 'save',
      onClick: onSubmit,
    },
  ]

  useEffect(() => {
    if (name === 'Edit') {
      dispatch(singleClient(id))
    }
  }, [])

  useEffect(() => {
    if (error) {
      setError(error)
    } else {
      setError('')
    }
    if (createSuccess || updateSuccess) {
      setError('')
      closeModal()
    }
  }, [error, createSuccess, updateSuccess])

  useEffect(() => {
    if (name === 'Edit' && sclient.payload[0]) {
      setFormData({
        client: sclient.payload[0].client,
        name: sclient.payload[0].name,
        type: sclient.payload[0].type,
        defaultValue: sclient.payload[0].default_value,
      })
    }
  }, [name, sclient.payload[0]])

  return (
    <Modal title={`${name} Client Settings`} options={options} icon="info">
      <div className={css['login-container']}>
        {erro && <span className={css['error-message']}>{erro}</span>}
        <form>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Client
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.client}
              onChange={e =>
                setFormData({ ...formData, client: e.target.value })
              }
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Name
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Type
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Default Value
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.defaultValue}
              onChange={e =>
                setFormData({ ...formData, defaultValue: e.target.value })
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default AddClientSettings

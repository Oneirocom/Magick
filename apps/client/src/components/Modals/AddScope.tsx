import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { Select, MenuItem } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  createScope,
  singleScope,
  updateScope,
} from '../../state/admin/scope/scopeState'

const AddScope = ({ closeModal, name, id }) => {
  const dispatch = useAppDispatch()
  const [erro, setError] = useState('')
  const { siscope, loading, error, createSuccess, updateSuccess } =
    useAppSelector(state => state.scope)
  const labels = ['Gb', 'Mb', 'Kb', 'Bytes']
  const [formData, setFormData] = useState({
    tables: '',
    fullTableSize: {
      label: '',
      value: '',
    },
    tableSize: {
      label: '',
      value: '',
    },
    recordCount: '',
  })

  const {
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async () => {
    if (name === 'Edit') {
      const data = { id, formData }
      dispatch(updateScope(data))
    } else {
      dispatch(createScope(formData))
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
      dispatch(singleScope(id))
    }
  }, [])

  useEffect(() => {
    if (name === 'Edit' && siscope.payload[0]) {
      setFormData({
        tables: siscope.payload[0].tables,
        fullTableSize: {
          label: siscope.payload[0].full_table_size.split(' ', 2)[1],
          value: siscope.payload[0].full_table_size.split(' ', 1),
        },
        tableSize: {
          label: siscope.payload[0].table_size.split(' ', 2)[1],
          value: siscope.payload[0].table_size.split(' ', 1),
        },
        recordCount: siscope.payload[0].record_count,
      })
    }
  }, [name, siscope.payload[0]])

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

  return (
    <Modal title={`${name} Scope`} options={options} icon="info">
      <div className={css['login-container']}>
        {error && <span className={css['error-message']}>{erro}</span>}
        <form>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Tables
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.tables}
              onChange={e =>
                setFormData({ ...formData, tables: e.target.value })
              }
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Full Table Size
            </label>
            <input
              type="number"
              className={css['input']}
              value={formData.fullTableSize.value}
              onChange={e =>
                setFormData({
                  ...formData,
                  fullTableSize: {
                    ...formData.fullTableSize,
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Size
            </label>
            <Select
              value={formData.fullTableSize.label}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  fullTableSize: {
                    ...formData.fullTableSize,
                    label: e.target.value,
                  },
                })
              }
              className={css['input']}
            >
              {labels.map((value, index) => {
                return (
                  <MenuItem value={value} className={css['select']} key={index}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Table Size
            </label>
            <input
              type="number"
              className={css['input']}
              value={formData.tableSize.value}
              onChange={e =>
                setFormData({
                  ...formData,
                  tableSize: { ...formData.tableSize, value: e.target.value },
                })
              }
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Size
            </label>
            <Select
              value={formData.tableSize.label}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  tableSize: {
                    ...formData.tableSize,
                    label: e.target.value,
                  },
                })
              }
              className={css['input']}
            >
              {labels.map((value, index) => {
                return (
                  <MenuItem value={value} className={css['select']} key={index}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Record Count
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.recordCount}
              onChange={e =>
                setFormData({ ...formData, recordCount: e.target.value })
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default AddScope

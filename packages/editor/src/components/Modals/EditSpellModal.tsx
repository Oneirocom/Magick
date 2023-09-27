// DOCUMENTED
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { closeTab, openTab, spellApi } from 'client/state'
/**
 * Represents a modal to edit spells.
 * @param {Object} props - properties passed to the component
 * @param {Function} props.closeModal - function to close the modal
 * @param {string} props.name - original name of the spell
 * @param {Object} props.tab - information about the selected tab
 * @returns {JSX.Element} The EditSpellModal component
 */
const EditSpellModal = ({ closeModal, name, tab }) => {
  const [error, setError] = useState('')
  const [patchSpell, { isLoading }] = spellApi.usePatchSpellMutation()

  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const { register, handleSubmit } = useForm()

  // Handle form submit
  const onSubmit = handleSubmit(async data => {
    const name = data.name
    data.name = tab.id + '-' + encodeURIComponent(btoa(data.name))

    const response: any = await patchSpell({
      id: tab.id,
      update: {
        name: name,
      },
    })

    if (response.error) {
      setError(response.error.data.error.message)
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }

    enqueueSnackbar('Spell saved', { variant: 'success' })

    dispatch(closeTab(tab.id))
    dispatch(
      openTab({
        name: data.name,
        spellName: data.name,
        type: 'spell',
      })
    )

    closeModal()
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'save',
      onClick: onSubmit,
      disabled: isLoading,
    },
  ]

  return (
    <Modal title="Rename Spell" options={options} icon="info">
      <div className={css['login-container']}>
        {error && <span className={css['error-message']}>{error}</span>}
        <form onSubmit={onSubmit}>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Spell name
            </label>
            <input
              type="text"
              className={css['input']}
              defaultValue={name}
              {...register('name')}
              placeholder="Enter spell name here"
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditSpellModal

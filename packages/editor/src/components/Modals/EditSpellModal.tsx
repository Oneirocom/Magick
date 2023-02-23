import md5 from 'md5'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { closeTab, openTab } from '../../state/tabs'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { useConfig } from '../../contexts/ConfigProvider'
import { getSpellApi } from '../../state/api/spells'

const EditSpellModal = ({ closeModal, spellName, name, tab }) => {
  const config = useConfig()
  const spellApi = getSpellApi(config)
  
  const [error, setError] = useState('')
  const [patchSpell, { isLoading }] = spellApi.usePatchSpellMutation()
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm()
  console.log('tab ::: ', tab)

  const onSubmit = handleSubmit(async data => {
    console.log('data ::: ', data)

    const spell = await spellApi.getSpell({ spellName: tab.spellName })

    console.log('spell ::: ', spell)

    const response: any = await patchSpell({
      id: spell.id,
      update: {
        name: data.name,
      },
    })

    console.log('response.error ::: ', response.error)

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

  // notes
  // after you save the spell, you need to refetch it?a

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
          {/* register your input into the hook by invoking the "register" function */}
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Spell name
            </label>
            <input
              type="text"
              className={css['input']}
              defaultValue={name}
              {...register('name')}
            />
          </div>
          {/* errors will return when field validation fails  */}
          {/* {errors.password && <span>This field is required</span>} */}
        </form>
      </div>
    </Modal>
  )
}

export default EditSpellModal

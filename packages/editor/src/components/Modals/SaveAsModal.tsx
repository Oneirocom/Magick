import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { getSpellApi } from '../../state/api/spells'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { closeTab } from '../../state/tabs'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import { useConfig } from '../../contexts/ConfigProvider'

const EditSpellModal = ({ tab, closeModal }) => {
  const config = useConfig()
  const spellApi = getSpellApi(config)

  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [saveSpell, { isLoading }] = spellApi.useSaveSpellMutation()
  const { data: spell } = spellApi.useGetSpellQuery(
    {
      spellName: tab.name,
      projectId: config.projectId,
    },
    {
      skip: !tab.name,
    }
  )
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    console.log("Inside Spell SUbmit")
    const saveResponse: any = await saveSpell({
      spell: {...spell.data[0], name: data.name},
      projectId: config.projectId
    })
    console.log(saveResponse)
    if (saveResponse.error) {
      // show snackbar
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      setError(saveResponse.error.message)
      return
    }

    enqueueSnackbar('Spell saved', { variant: 'success' })

    // close current tab and navigate to the new spell
    dispatch(closeTab(tab.id))
    navigate(`/magick/${tab.id}-${encodeURIComponent(atob(data.name))}`)

    closeModal()
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'Save spell as',
      onClick: onSubmit,
      disabled: isLoading,
    },
  ]

  return (
    <Modal title="Save As" options={options} icon="info">
      <div className={css['login-container']}>
        {error && <span className={css['error-message']}>{error}</span>}
        <form>
          {/* register your input into the hook by invoking the "register" function */}
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Spell name
            </label>
            <input
              type="text"
              className={css['input']}
              defaultValue={tab.name}
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

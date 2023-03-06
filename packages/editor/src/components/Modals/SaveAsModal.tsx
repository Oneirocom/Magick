import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { getSpellApi } from '../../state/api/spells'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { closeTab } from '../../state/tabs'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import defaultGraph from '../../data/graphs/default'
import { useConfig } from '../../contexts/ConfigProvider'
import md5 from 'md5'
const EditSpellModal = ({ tab, closeModal }) => {
  const config = useConfig()
  const spellApi = getSpellApi(config)

  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [saveSpell, { isLoading }] = spellApi.useSaveSpellMutation()
  const [newSpell] = spellApi.useNewSpellMutation()
  const { data: spell } = spellApi.useGetSpellByIdQuery(
    {
      spellName: tab.name,
      id: tab.id,
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
    const response = await newSpell({
      graph: defaultGraph,
      name: data.name,
      projectId: config.projectId,
      hash: md5(JSON.stringify(defaultGraph.nodes)),
    })
    const saveResponse: any = await saveSpell({
      spell: { ...spell.data[0], name: data.name, id: response.data.id },
      projectId: config.projectId,
    })
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
    //dispatch(closeTab(tab.id))
    navigate(
      `/magick/${response.data.id + '-' + encodeURIComponent(btoa(data.name))}`
    )

    closeModal()
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'Save A Copy',
      onClick: onSubmit,
      disabled: isLoading,
    },
  ]

  return (
    <Modal title="Save A Copy" options={options} icon="info">
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
              placeholder="Enter new spell name here"
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

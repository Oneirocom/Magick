// DOCUMENTED
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { getTemplates } from 'client/core'
import { useConfig } from '@magickml/providers'
import { v4 as uuidv4 } from 'uuid'
import { spellApi } from 'client/state'

// Initial graph for the spell
const defaultGraph = getTemplates().spells[0].graph

/**
 * EditSpellModal component for saving a copy of an existing spell.
 * @param {Object} props - Component properties
 * @param {Object} props.tab - Tab data
 * @param {Function} props.closeModal - Function to close the component modal
 * @returns {React.JSX.Element} - EditSpellModal component
 */
const EditSpellModal = ({ tab, closeModal }) => {
  // Get config from context
  const config = useConfig()

  // State for handling error messages
  const [error, setError] = useState('')

  // Mutation hooks for saving and creating spells
  const [saveSpell, { isLoading }] = spellApi.useSaveSpellMutation()
  const [newSpell] = spellApi.useNewSpellMutation()

  // Fetch the spell by ID
  const { data: spell } = spellApi.useGetSpellQuery(
    { id: tab.id },
    { skip: !tab.name }
  )

  // Snackbar for showing notifications
  const { enqueueSnackbar } = useSnackbar()

  // Initialize form handling
  const { register, handleSubmit } = useForm()

  // Function to handle form submission
  const onSubmit = handleSubmit(async data => {
    const id = uuidv4()
    // Create a new spell
    const response = (await newSpell({
      id,
      graph: defaultGraph,
      name: data.name,
      projectId: config.projectId,
    })) as any

    console.log('response is', response)

    // Save the spell
    const saveResponse: any = await saveSpell({
      spell: { ...spell.data, name: data.name, id },
      projectId: config.projectId,
    })

    // Show error if saving spell fails
    if (saveResponse.error) {
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      setError(saveResponse.error.message)
      return
    }

    // Show success message
    enqueueSnackbar('Spell saved', { variant: 'success' })

    // Close the modal
    closeModal()
  })

  // Define modal options
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
        </form>
      </div>
    </Modal>
  )
}

export default EditSpellModal

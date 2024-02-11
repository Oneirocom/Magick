import Modal from '../Modal/Modal'
import css from './createSpellModal.module.css'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useConfig, useTabLayout } from '@magickml/providers'
import { v4 as uuidv4 } from 'uuid'
import { spellApi } from 'client/state'

import {
  adjectives,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import FileInput from '../FileInput/FileInput'
import { FileUpload } from '@mui/icons-material'

import behaveGraph from '../../graphs/graph.json'
import { useModal } from '../../contexts/ModalProvider'
import { Input } from '@magickml/client-ui'

// Custom configuration for unique name generator
const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

const CreateSpellModal = () => {
  const config = useConfig()
  const { openTab } = useTabLayout()
  const { closeModal } = useModal()
  const [error, setError] = useState<string | null>(null)
  const [, setLoading] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const [newSpell] = spellApi.useNewSpellMutation()
  const { register, handleSubmit } = useForm()

  /**
   * Handles loading a selected file for opening a spell.
   * @param event - FileReader onload event
   */
  const onReaderLoad = async (event): Promise<void> => {
    const spellData = JSON.parse(event.target.result)

    // Create new spell
    const response = (await newSpell({
      id: uuidv4(),
      graph: spellData.graph,
      name: `${spellData.name}-copy`,
      projectId: config.projectId,
      type: spellData.type,
    })) as any

    handleSpellResponse(response)
  }

  /**
   * Load a selected file
   * @param selectedFile - File to load
   */
  const loadFile = (selectedFile): void => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(selectedFile)
  }

  const onCreate = handleSubmit(async data => {
    try {
      const placeholderName = uniqueNamesGenerator(customConfig)
      const name = data.name || placeholderName
      setLoading(true)
      const response = (await newSpell({
        id: uuidv4(),
        graph: behaveGraph,
        name,
        type: 'behave',
        projectId: config.projectId,
      })) as any

      handleSpellResponse(response)
    } catch (err) {
      console.error('ERROR!', err)
    }
  })

  const handleSpellResponse = response => {
    if (handleError(response)) return
    openTab({
      id: response.data.name,
      name: response.data.name,
      spellName: response.data.name,
      switchActive: true,
      type: response.data.type || 'spell',
      params: {
        spellId: response.data.id,
      },
    })

    closeModal()
    setLoading(false)
  }

  const handleError = response => {
    if ('error' in response) {
      if ('status' in response.error) {
        const err = response.error as any
        const errMsg = err.data.error.message
        setError(errMsg as string)
        enqueueSnackbar(`Error creating spell. ${errMsg}.`, {
          variant: 'error',
        })
        return true
      }
    }
    return false
  }

  const options = [
    {
      component: (
        <FileInput
          // todo fix this typing issue
          // @ts-ignore
          loadFile={loadFile}
          Icon={
            <FileUpload
              style={{
                height: '1em',
                width: '1em',
                marginRight: '0.5em',
              }}
            />
          }
          innerText={'Import'}
        />
      ),
    },
    {
      label: 'Create',
      onClick: onCreate,
      className: css['create-btn'],
    },
  ]

  return (
    <Modal title="New Spell" options={options} className={css['delete-modal']}>
      <div className={css['spell-details']}>
        <form
          onSubmit={e => {
            e.preventDefault()
            onCreate()
          }}
        >
          <Input
            type="text"
            defaultValue=""
            className="w-full p-2 border border-gray-300 rounded text-lg"
            placeholder="Enter spell name here"
            {...register('name')}
          />
          {error && <span className={css['error-message']}>{error}</span>}
        </form>
      </div>
      <div
        style={{
          width: 'var(--c62)',
          backgroundColor: 'var(--foreground-color',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      ></div>
    </Modal>
  )
}

export default CreateSpellModal

import Modal from '../Modal/Modal'
import { GraphData } from 'shared/core'
import css from './createSpellModal.module.css'
import { getTemplates } from 'client/core'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TemplatePanel from '../../components/TemplatePanel'
import { useConfig, useTabLayout, useTreeData } from '@magickml/providers'
import LoadingButton from '@mui/lab/LoadingButton'
import { v4 as uuidv4 } from 'uuid'
import md5 from 'md5'
import emptyImg from './empty.png'
import { spellApi } from 'client/state'

import {
  adjectives,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'

export type Template = {
  label?: string
  bg?: string
  graph: GraphData
}

// Custom configuration for unique name generator
const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

const CreateSpellModal = ({ closeModal }) => {
  const config = useConfig()
  const { openTab } = useTabLayout()

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    getTemplates().spells[0] as Template
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const [newSpell] = spellApi.useNewSpellMutation()
  const [spellExists] = spellApi.useLazyGetSpellQuery()
  const { register, handleSubmit } = useForm()

  const onCreate = handleSubmit(async data => {
    try {
      if (!selectedTemplate) return
      const placeholderName = uniqueNamesGenerator(customConfig)
      const name = data.name || placeholderName
      setLoading(true)
      const spellCheck = await spellExists({
        spellName: name,
        projectId: config.projectId,
        hash: md5(JSON.stringify(selectedTemplate?.graph.nodes)),
      })
      if (spellCheck.data.total > 0) {
        enqueueSnackbar('A spell with that name already exists', {
          variant: 'error',
        })
        return
      }
      const response = (await newSpell({
        id: uuidv4(),
        graph: selectedTemplate.graph,
        name,
        projectId: config.projectId,
        hash: md5(JSON.stringify(selectedTemplate?.graph.nodes)),
      })) as any

      if ('error' in response) {
        if ('status' in response.error) {
          const err = response.error as any
          const errMsg = err.data.error.message
          setError(errMsg as string)
          enqueueSnackbar(`Error saving spell. ${errMsg}.`, {
            variant: 'error',
          })
          return
        }
      }

      openTab({
        id: response.data.name,
        name: response.data.name,
        spellName: response.data.name,
        switchActive: true,
        type: 'spell',
        params: {
          spellId: response.data.id
        }
      })

      setLoading(false)
      closeModal()
    } catch (err) {
      console.error('ERROR!', err)
    }
  })

  const options = [{
    label: 'Create',
    onClick: onCreate,
    disabled: !selectedTemplate,
    className: css['create-btn'],
  }]

  return (
    <Modal
      title="New Spell"
      options={options}
      icon="info"
      className={css['delete-modal']}
    >
      <div className={css['spell-details']}>
        <form
          onSubmit={e => {
            e.preventDefault()
            onCreate()
          }}
        >
          <input
            type="text"
            className={css['input']}
            defaultValue=""
            placeholder="Enter spell name here"
            {...register('name')}
          />
          {error && <span className={css['error-message']}>{error}</span>}
        </form>
      </div>
      <div
        style={{
          width: 'var(--c62)',
          backgroundColor: 'var(--dark-2)',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {(getTemplates().spells as Template[]).map((template, i) => (
          <TemplatePanel
            setSelectedTemplate={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
            template={{ ...template, bg: template?.bg ?? emptyImg }}
            key={i}
          />
        ))}
      </div>
    </Modal>
  )
}

export default CreateSpellModal
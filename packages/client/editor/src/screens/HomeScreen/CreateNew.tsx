// DOCUMENTED
import { Button, Panel } from 'client/core'
import { GraphData } from 'shared/core'
import { getTemplates } from 'client/core'
import md5 from 'md5'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  adjectives,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import TemplatePanel from '../../components/TemplatePanel'
import { useConfig, useTreeData } from '@magickml/providers'
import LoadingButton from '@mui/lab/LoadingButton'
import emptyImg from './empty.png'
import css from './homeScreen.module.css'
import { v4 as uuidv4 } from 'uuid'
import { spellApi } from 'client/state'

// Custom configuration for unique name generator
const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

export type Template = {
  label?: string
  bg?: string
  graph: GraphData
}

/**
 * CreateNew component for creating a new spell.
 */
const CreateNew = () => {
  const config = useConfig()

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    getTemplates().spells[0] as Template
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [newSpell] = spellApi.useNewSpellMutation()
  const [spellExists] = spellApi.useLazyGetSpellQuery()
  const { register, handleSubmit } = useForm()
  const { setIsAdded } = useTreeData()

  /**
   * Handle creation process of a new spell.
   */
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
      setLoading(false)
      setIsAdded(true)
      navigate(
        `/magick/${response.data.id + '-' + encodeURIComponent(btoa(response.data.name))
        }`
      )
    } catch (err) {
      console.error('ERROR!', err)
    }
  })

  return (
    <Panel shadow flexColumn>
      <h1>Create New</h1>
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
      <div className={css['button-row']}>
        <Button
          onClick={() => {
            window.history.back()
          }}
        >
          cancel
        </Button>
        <LoadingButton
          className={`${!selectedTemplate ? 'disabled' : 'primary'} ${css.button
            }`}
          loading={loading}
          onClick={onCreate}
          variant="outlined"
          sx={{ color: '#fff !important', border: 'none !important' }}
        >
          CREATE
        </LoadingButton>
      </div>
    </Panel>
  )
}

export default CreateNew

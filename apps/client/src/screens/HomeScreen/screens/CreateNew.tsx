import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GraphData } from '@magickml/core'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'
import { useNavigate } from 'react-router-dom'

import { useNewSpellMutation } from '../../../state/api/spells'
import Panel from '../../../components/Panel/Panel'
import emptyImg from '../empty.png'
import css from '../homeScreen.module.css'
import TemplatePanel from '../components/TemplatePanel'
import defaultGraph from '../../../data/graphs/default'

const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
}

export type Template = {
  label: string
  bg: string
  graph: GraphData
}

export const thothTemplates = [
  { label: 'Starter', bg: emptyImg, graph: defaultGraph },
  // { label: 'Language example', bg: langImg, graph: defaultChain },
]

const CreateNew = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [newSpell] = useNewSpellMutation()
  const { register, handleSubmit } = useForm()

  const onCreate = handleSubmit(async data => {
    try {
      const placeholderName = uniqueNamesGenerator(customConfig)
      const name = data.name || placeholderName
      const response = await newSpell({
        graph: selectedTemplate?.graph,
        name,
      })

      if ('error' in response) {
        console.log('error in response', response.error)
        if ('status' in response.error) {
          const err = response.error
          // I am annoyed by RTK error typing.
          // @ts-expect-error
          const errMsg = err.data.error.message
          setError(errMsg as string)
          enqueueSnackbar(`Error saving spell. ${errMsg}.`, {
            variant: 'error',
          })
          return
        }
      }

      navigate(`/magick/${name}`)
    } catch (err) {
      console.log('ERROR!!', err)
    }
  })

  return (
    <Panel shadow flexColumn>
      <h1> Create New </h1>
      <div className={css['spell-details']}>
        <form>
          <label className={css['label']} htmlFor="">
            Spell name
          </label>
          <input
            type="text"
            className={css['input']}
            defaultValue=""
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
          gap: 'var(--extraSmall)',
        }}
      >
        {thothTemplates.map((template, i) => (
          <TemplatePanel
            setSelectedTemplate={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
            template={template}
            key={i}
          />
        ))}
      </div>
      <div className={css['button-row']}>
        <button
          onClick={() => {
            window.history.back()
          }}
        >
          cancel
        </button>
        <button
          className={!selectedTemplate ? 'disabled' : 'primary'}
          onClick={onCreate}
        >
          CREATE
        </button>
      </div>
    </Panel>
  )
}

export default CreateNew

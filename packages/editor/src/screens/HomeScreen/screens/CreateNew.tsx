import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { GraphData } from '@magickml/engine'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'
import { useNavigate } from 'react-router-dom'

import { getSpellApi } from '../../../state/api/spells'
import Panel from '../../../components/Panel/Panel'
import emptyImg from '../empty.png'
import css from '../homeScreen.module.css'
import TemplatePanel from '../components/TemplatePanel'
import defaultGraph from '../../../data/graphs/default'
import threeovGraph from '../../../data/graphs/threeov'
import md5 from 'md5'
import { useConfig } from '../../../contexts/ConfigProvider'
import { uuidv4 } from 'packages/editor/src/utils/uuid'

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

export const magickTemplates: Template[] = [
  { label: 'Starter', bg: emptyImg, graph: defaultGraph as any as GraphData },
  {
    label: '3OV for WordPress',
    bg: emptyImg,
    graph: threeovGraph as any as GraphData,
  },
]

const CreateNew = () => {
  const config = useConfig()
  const spellApi = getSpellApi(config)

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    magickTemplates[0]
  )
  const [error, setError] = useState<string | null>(null)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [newSpell] = spellApi.useNewSpellMutation()
  const { register, handleSubmit } = useForm()

  const onCreate = handleSubmit(async data => {
    try {
      if (!selectedTemplate) return
      const placeholderName = uniqueNamesGenerator(customConfig)
      const name = data.name || placeholderName
      const response = await newSpell({
        graph: selectedTemplate.graph,
        name,
        projectId: config.projectId,
        hash: md5(JSON.stringify(selectedTemplate?.graph.nodes)),
      })
      console.log(name)
      console.log(response)

      if ('error' in response) {
        console.log('error in response', response.error)
        if ('status' in response.error) {
          const err = response.error

          const errMsg = err.data.error.message
          setError(errMsg as string)
          enqueueSnackbar(`Error saving spell. ${errMsg}.`, {
            variant: 'error',
          })
          return
        }
      }

      navigate(`/magick/${response.data.id +"-"+ encodeURIComponent(btoa(name))}`)
    } catch (err) {
      console.log('ERROR!!', err)
    }
  })

  return (
    <Panel shadow flexColumn>
      <h1> Create New </h1>
      <div className={css['spell-details']}>
        <form
          onSubmit={e => {
            e.preventDefault()
            onCreate()
          }}
        >
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
        {magickTemplates.map((template, i) => (
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

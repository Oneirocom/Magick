import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GraphData } from '@magickml/engine'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from 'unique-names-generator'
import { useNavigate } from 'react-router-dom'

import { spellApi } from '../../../state/api/spells'
import { Panel } from '@magickml/client-core'
import emptyImg from '../empty.png'
import css from '../homeScreen.module.css'
import TemplatePanel from '../components/TemplatePanel'
import defaultGraph from '../../../data/graphs/default'

// TODO: move these into plugins
import discordGraph from '../../../data/graphs/discord'
import restGraph from '../../../data/graphs/rest'

import threeovGraph from '../../../data/graphs/threeov'
import md5 from 'md5'
import { useConfig } from '../../../contexts/ConfigProvider'
import { Button } from '@magickml/client-core'

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
  { label: 'Discord Bot', bg: emptyImg, graph: discordGraph as any as GraphData },
  { label: 'REST API', bg: emptyImg, graph: restGraph as any as GraphData },
  {
    label: '3OV for WordPress',
    bg: emptyImg,
    graph: threeovGraph as any as GraphData,
  },
]

const CreateNew = () => {
  const config = useConfig()

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    magickTemplates[0]
  )
  const [error, setError] = useState<string | null>(null)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [newSpell] = spellApi.useNewSpellMutation()
  const [spellExists] = spellApi.useLazyGetSpellQuery()
  const { register, handleSubmit } = useForm()

  const onCreate = handleSubmit(async data => {
    try {
      if (!selectedTemplate) return
      const placeholderName = uniqueNamesGenerator(customConfig)
      const name = data.name || placeholderName
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
      const response = await newSpell({
        graph: selectedTemplate.graph,
        name,
        projectId: config.projectId,
        hash: md5(JSON.stringify(selectedTemplate?.graph.nodes)),
      })

      if ('error' in response) {
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

      navigate(
        `/magick/${
          response.data.id + '-' + encodeURIComponent(btoa(response.data.name))
        }`
      )
    } catch (err) {
      console.error('ERROR!', err)
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
        <Button
          onClick={() => {
            window.history.back()
          }}
        >
          cancel
        </Button>
        <Button
          className={!selectedTemplate ? 'disabled' : 'primary'}
          onClick={onCreate}
        >
          CREATE
        </Button>
      </div>
    </Panel>
  )
}

export default CreateNew

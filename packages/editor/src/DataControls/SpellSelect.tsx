import { Select } from '@magickml/client-core'
import { GraphData } from '@magickml/engine'
import { templates } from '@magickml/client-core'
import md5 from 'md5'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

import { useConfig } from '../contexts/ConfigProvider'
import { spellApi } from '../state/api/spells'
import { useAppDispatch } from '../state/hooks'
import { openTab } from '../state/tabs'

const defaultGraph = templates.spells[0].graph

const ModuleSelect = ({ control, updateData, initialValue }) => {
  const config = useConfig()
  const dispatch = useAppDispatch()
  const [getSpell, { data: spell }] = spellApi.useLazyGetSpellByJustIdQuery()
  const { data: spells } = spellApi.useGetSpellsQuery({
    projectId: config.projectId,
  })
  const [newSpell] = spellApi.useNewSpellMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { dataKey } = control

  // Handle what happens when a new spell is selected and fetched
  useEffect(() => {
    if (!spell) return

    console.log('new spell', spell)

    const _spell = spell.data[0]
    update(_spell)
    _openTab(_spell)
  }, [spell])

  const optionArray = () => {
    if (!spells) return
    return spells.data.map((module, index) => ({
      value: module,
      label: module.name,
    }))
  }

  const _openTab = async spell => {
    const tab = {
      name: spell.id + "-" + encodeURIComponent(btoa(spell.name)),
      spellName: spell.name,
      type: 'spell',
      openNew: false,
      switchActive: false,
    }

    dispatch(openTab(tab))
  }

  
  const onChange = async e => {
    if (!e) return
    const spell  = {...e.value}
    getSpell({
      projectId: config.projectId,
      id: spell.id,
    })
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const onCreateOption = async value => {
    try {
      const response = await newSpell({
        name: value,
        graph: defaultGraph as unknown as GraphData,
        projectId: config.projectId,
        hash: md5(Math.random()),
      })

      getSpell({
        id: (response as {data: {id: String}}).data.id,
        projectId: config.projectId,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Error creating module', err)
      enqueueSnackbar('Error creating module', {
        variant: 'error',
      })
    }
  }

  const noOptionsMessage = inputValue => {
    return <span>Start typing to create a module</span>
  }

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    return (
      inputValue.length !== 0
      // && selectOptions.some((option) => option.value !== inputValue)
    )
  }

  return (
    <div style={{ flex: 1 }}>
      <Select
        searchable
        creatable
        createOptionPosition="top"
        isValidNewOption={isValidNewOption}
        noOptionsMessage={noOptionsMessage}
        options={optionArray()}
        onChange={onChange}
        defaultInputValue={initialValue}
        onCreateOption={onCreateOption}
        placeholder="select module"
      />
    </div>
  )
}

export default ModuleSelect

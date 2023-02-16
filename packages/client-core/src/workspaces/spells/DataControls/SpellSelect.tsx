import { useSnackbar } from 'notistack'
import { GraphData } from '@magickml/engine'
import { useEffect } from 'react'

import { useAppDispatch } from '../../../state/hooks'
import { openTab } from '../../../state/tabs'
// import { useModule } from '../../../contexts/ModuleProvider'
import Select from '../../../components/Select/Select'
import {
  useLazyGetSpellQuery,
  useGetSpellsQuery,
  useNewSpellMutation,
} from '../../../state/api/spells'
import defaultGraph from '../../../data/graphs/default'

const ModuleSelect = ({ control, updateData, initialValue }) => {
  const dispatch = useAppDispatch()

  const [getSpell, { data: spell }] = useLazyGetSpellQuery()
  const { data: spells } = useGetSpellsQuery()
  const [newSpell] = useNewSpellMutation()

  const { enqueueSnackbar } = useSnackbar()
  const { dataKey } = control

  // Handle what happens when a new spell is selected and fetched
  useEffect(() => {
    if (!spell) return

    update(spell)
    _openTab(spell)
  }, [spell])

  const optionArray = () => {
    if (!spells) return
    return spells.data.map((module, index) => ({
      value: module.name,
      label: module.name,
    }))
  }

  const _openTab = async spell => {
    const tab = {
      name: spell.name,
      spellId: spell.name,
      type: 'spell',
      openNew: false,
      switchActive: false,
    }

    dispatch(openTab(tab))
  }

  // TODO fix on change to handle loading a single spell
  const onChange = async ({ value }) => {
    getSpell({
      spellId: value,
    })
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }

  const onCreateOption = async value => {
    try {
      await newSpell({
        name: value,
        graph: defaultGraph as unknown as GraphData,
      })

      getSpell({
        spellId: value,
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

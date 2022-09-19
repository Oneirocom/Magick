import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

import { GraphData } from '@thothai/core'

// import { useModule } from '../../../contexts/ModuleProvider'
import Select from '../../../components/Select/Select'
import { useAuth } from '../../../contexts/AuthProvider'
import defaultGraph from '../../../data/graphs/default'
import {
    useGetSpellsQuery, useLazyGetSpellQuery, useNewSpellMutation
} from '../../../state/api/spells'
import { useAppDispatch } from '../../../state/hooks'
import { openTab } from '../../../state/tabs'

const ModuleSelect = ({ control, updateData, initialValue }) => {
  const dispatch = useAppDispatch()

  const [getSpell, { data: spell }] = useLazyGetSpellQuery()
  const { user } = useAuth()
  const { data: spells } = useGetSpellsQuery(user?.id as string)
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
    return spells.map((module, index) => ({
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
      userId: user?.id as string,
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
        user: user?.id,
      })

      getSpell({
        spellId: value,
        userId: user?.id as string,
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

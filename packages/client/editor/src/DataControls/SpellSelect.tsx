// DOCUMENTED
import md5 from 'md5'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

import { Select } from 'client/core'
import { GraphData } from 'shared/core'
import { getTemplates } from 'client/core'
import { spellApi } from 'client/state'

import { useConfig } from '@magickml/providers'

/**
 * Component that renders the Select element for selecting and creating modules.
 * @param {Object} props - Component properties.
 * @param {Object} props.control - Controller object for the input field.
 * @param {Function} props.updateData - Function to update the data when a module is selected or created.
 * @param {string} props.initialValue - Initial value of the Select element.
 * @returns {JSX.Element} The rendered Select element for selecting or creating modules.
 */
const ModuleSelect = ({ control, updateData, initialValue }) => {
  const config = useConfig()
  const [getSpell, { data: spell }] = spellApi.useLazyGetSpellByJustIdQuery()
  const { data: spells } = spellApi.useGetSpellsQuery({
    projectId: config.projectId,
  })
  const [newSpell] = spellApi.useNewSpellMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { dataKey } = control

  // Default graph for spells
  const defaultGraph = getTemplates().spells[0].graph

  // Handle what happens when a new spell is selected and fetched
  useEffect(() => {
    if (!spell) return

    update(spell)
  }, [spell])

  /**
   * Generate the option array for the Select element.
   * @returns {Array<Object>} Array of option objects containing value and label.
   */
  const optionArray = () => {
    if (!spells) return
    return spells.data.map((module, index) => ({
      value: module,
      label: module.name,
    }))
  }

  const onChange = async e => {
    if (!e) return
    const spell = { ...e.value }
    getSpell({
      projectId: config.projectId,
      id: spell.id,
    })
  }

  /**
   * Update the data with the given update object.
   * @param {Object} update - The update object.
   */
  const update = update => {
    updateData({ [dataKey]: update })
  }

  /**
   * Handle creating new module with value as name.
   * @param {string} value - The name of the module to create.
   */
  const onCreateOption = async value => {
    try {
      const response = await newSpell({
        name: value,
        graph: defaultGraph as unknown as GraphData,
        projectId: config.projectId,
        hash: md5(Math.random()),
      })

      getSpell({
        id: (response as { data: { id: string } }).data.id,
        projectId: config.projectId,
      })
    } catch (err) {
      enqueueSnackbar('Error creating module', { variant: 'error' })
    }
  }

  /**
   * Function to render message with empty options.
   * @param {string} inputValue - The input value.
   * @returns {JSX.Element} The rendered message.
   */
  const noOptionsMessage = inputValue => {
    return <span>Start typing to create a module</span>
  }

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    return inputValue.length !== 0
  }

  return (
    <div style={{ flex: 1 }}>
      <Select
        searchable
        creatable
        defaultValue={initialValue}
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

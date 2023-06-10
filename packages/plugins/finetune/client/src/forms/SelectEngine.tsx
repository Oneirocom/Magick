// DOCUMENTED

/**
 * Interface describing props for SelectEngine component.
 */
import { useFormContext } from 'react-hook-form'
import Select from 'react-select'
interface SelectEngineProps {
  engines?: string[]
  name: string
  required?: boolean
}

/**
 * An array of base engines.
 */
export const BaseEngines: string[] = [
  'ada',
  'babbage',
  'curie',
  'davinci',
  'gpt-4',
]

/**
 * An array of Instruct engines.
 */
export const InstructEngines: string[] = [
  'davinci-instruct-beta',
  'curie-instruct-beta',
]

/**
 * A component representing React Select engine selector.
 *
 * @param {SelectEngineProps} props - The props object containing optional engines, name and required boolean value.
 * @returns {JSX.Element} - The Select component.
 */
export default function SelectEngine({
  engines = BaseEngines,
  name = 'model',
  required,
}: SelectEngineProps): JSX.Element {
  const form = useFormContext()

  // Create an array of options based on the provided engines array.
  const options = engines.map(engine => ({
    label: engine,
    value: engine,
  }))

  return (
    <Select
      {...form.register(name, { required })}
      // Apply CSS classes.
      className="w-44"
      classNamePrefix="react-select"
      // Set default value.
      defaultValue={options.find(
        option => option.value === form.getValues()[name]
      )}
      // Allow deselect if input is not required.
      isClearable={!required}
      escapeClearsValue
      isSearchable={false}
      // Update form value on selection change.
      onChange={selection => form.setValue(name, selection?.value ?? '')}
      // Set options.
      options={options}
    />
  )
}

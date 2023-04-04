// DOCUMENTED 
/**
 * A SelectEngine component that renders a dropdown menu of engine options.
 * @param {Object} props - React props object
 * @param {string[]} props.engines - The engines to display in the dropdown menu
 * @param {string} [props.name='model'] - The name of the form field associated with the SelectEngine component
 * @param {boolean} [props.required=false] - Whether the SelectEngine component is a required form field
 */
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

// Available base engines
export const BaseEngines: string[] = ['ada', 'babbage', 'curie', 'davinci', 'gpt-4'];

// Available instruct engines
export const InstructEngines: string[] = ['davinci-instruct-beta', 'curie-instruct-beta'];

export default function SelectEngine(props: {
  engines?: string[];
  name?: string;
  required?: boolean;
}) {
  const { engines = BaseEngines, name = 'model', required } = props;

  // Get the form and register the field with the specified name
  const { register, getValues, setValue } = useFormContext();

  // Build the array of options to display in the dropdown menu
  const options = engines.map((engine) => ({
    label: engine,
    value: engine,
  }));

  /**
   * onChange event handler that updates the field value in the form.
   * @param {Object} selection - The selected engine option
   * @param {string} selection.value - The value property of the selected engine option
   */
  function handleOnChange(selection: { value: string }) {
    setValue(name, selection?.value ?? '');
  }

  return (
    <Select
      {...register(name, { required })}
      className="w-44"
      classNamePrefix="react-select"
      defaultValue={options.find(
        (option) => option.value === getValues()[name]
      )}
      isClearable={!required}
      escapeClearsValue
      isSearchable={false}
      onChange={handleOnChange}
      options={options}
      styles={{
        option: (styles) => {
          return {
            ...styles,
            color: 'black',
          };
        },
      }}
    />
  );
}
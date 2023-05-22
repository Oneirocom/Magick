// DOCUMENTED
/**
 * Props for Form component
 * @typedef {Object} Props
 * @property {string} value - current value of input field
 * @property {string} placeHolder - placeholder text for input field
 * @property {string} [type] - type of input field, defaults to 'text'
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - function to be called when the input value changes
 * @property {(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} onAdd - function to be called when the add button is clicked
 */

import { Button } from '@magickml/client-core'

/**
 * Form component that renders a form with an input field and a button to add input value
 * @param {Props} props - props for Form component
 * @returns {JSX.Element} - rendered Form component
 */
const Form = ({
  value,
  placeHolder,
  type = 'text',
  onChange,
  onAdd,
}): JSX.Element => {
  return (
    <form>
      {/* Flexbox container for input field and add button */}
      <div style={{ display: 'flex', gap: 'var(--extraSmall)' }}>
        {/* Input field */}
        <input
          style={{ flex: 6 }}
          value={value}
          type={type}
          onChange={onChange}
          required
          placeholder={placeHolder}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onAdd(e)
            }
          }}
        />
        {/* Add button */}
        <Button style={{ flex: 1 }} onClick={onAdd} type="submit">
          + Add
        </Button>
      </div>
    </form>
  )
}

export default Form

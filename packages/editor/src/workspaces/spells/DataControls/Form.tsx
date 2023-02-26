import { Button } from '@magickml/client-core'

interface Props {
  value: string
  placeHolder: string
  type?: string
  onChange: (e) => void
  onAdd: (e) => void
}

const Form = ({
  value,
  placeHolder,
  type = 'text',
  onChange,
  onAdd,
}: Props) => {
  return (
    <form>
      <div style={{ display: 'flex', gap: 'var(--extraSmall)' }}>
        <input
          style={{ flex: 6 }}
          value={value}
          type={type}
          onChange={onChange}
          required
          placeholder={placeHolder}
        />
        <Button style={{ flex: 1 }} onClick={onAdd} type="submit">
          + Add
        </Button>
      </div>
    </form>
  )
}

export default Form

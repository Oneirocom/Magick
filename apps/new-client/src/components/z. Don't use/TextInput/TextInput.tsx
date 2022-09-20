import { useState, useEffect } from 'react'

import css from './textinput.module.css'

const TextInput = ({ props }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(props?.value)
  }, [props])

  const onChange = e => {
    setValue(e.target?.value)
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`${css['text-input']}` + props?.className}
    />
  )
}

export default TextInput

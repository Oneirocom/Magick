//@ts-ignore
import React from 'react'

export const KeyInput = ({
  value,
  setValue,
  secret,
  style,
}: {
  value: string
  setValue: any
  secret: boolean
  style: any
}) => {
  const addKey = (str: string) => {
    // discount random key presses, could def have better sense checking
    // ethereum addresses are 42 chars
    if (str.length > 31) {
      setValue(str)
    }
  }

  const removeKey = () => {
    setValue('')
  }

  const obfuscateKey = (str: string) => {
    const first = str.substring(0, 6)
    const last = str.substring(str.length - 4, str.length)
    return `${first}....${last}`
  }

  return value ? (
    <>
      <p>{secret ? obfuscateKey(value) : value}</p>
      <button onClick={removeKey}>remove</button>
    </>
  ) : (
    <input
      type={secret ? 'password' : 'input'}
      style={style}
      defaultValue={value}
      onChange={e => {
        addKey(e.target.value)
      }}
      placeholder="Insert your key here"
    />
  )
}

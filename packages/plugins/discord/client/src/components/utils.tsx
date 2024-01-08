// DOCUMENTED
/**
 * A functional React component to be used for inputting and displaying private keys.
 * @param value - The private key string value.
 * @param setValue - A function to set the state value of the private key.
 * @param secret - A boolean value indicating whether or not to obfuscate the private key.
 * @returns A React.JSX.Element of either the private key input field or a display of the private key value.
 */
import React from 'react';

export const KeyInput: React.FC<{ value: string, setValue: React.Dispatch<React.SetStateAction<string>>, secret: boolean }> = ({ value, setValue, secret }) => {
  /**
   * A function to update the component's state value with a new private key string value.
   * @param str - The new private key string value.
   * @returns void.
   */
  const addKey = (str: string): void => {
    // Disregard inputs that are probably not valid keys (i.e. random key presses).
    // Ethereum addresses are typically 42 characters.
    if (str.length > 31) {
      setValue(str);
    }
  }

  /**
   * A function to reset the component's state value to an empty string.
   * @returns void.
   */
  const removeKey = (): void => {
    setValue('');
  }

  /**
   * A function to obfuscate a private key string's middle characters with ellipsis.
   * @param str - The private key string value.
   * @returns The obfuscated private key string value.
   */
  const obfuscateKey = (str: string): string => {
    const first = str.substring(0, 6);
    const last = str.substring(str.length - 4, str.length);
    return `${first}....${last}`;
  }

  return (value ? (
    <>
      {/* Conditionally display the private key, obfuscating if secret=true */}
      <span>{secret ? obfuscateKey(value) : value}</span>
      {/* Render remove button */}
      <button onClick={removeKey} style={{ cursor: 'pointer' }}>remove</button>
    </>
  ) : (
    // Render input field
    <input
      type={secret ? 'password' : 'input'}
      defaultValue={value}
      placeholder="Insert your key here"
      onChange={e => {
        addKey(e.target.value);
      }}
    />
  )
  );
}

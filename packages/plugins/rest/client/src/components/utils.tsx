// DOCUMENTED
/**
 * A React component that allows the user to input a secret value, such as a private key
 * If a value is inputted, it can be revealed or removed.
 * @param {Object} props - Component props
 * @param {string} props.value - The value of the input field
 * @param {function} props.setValue - Callback function to update the {@link value} state
 * @param {boolean} props.secret - Whether the input value should be obfuscated
 * @return {React.JSX.Element} Key input React component
 */

import React, { ChangeEvent } from 'react';

interface KeyInputProps {
  value: string;
  setValue(value: string): void;
  secret: boolean;
}

export const KeyInput: React.FC<KeyInputProps> = ({ value, setValue, secret }) => {

  /**
   * Updates the {@link value} state when new input is added, but only if the input
   * has a valid length (31 or more characters).
   * @param {string} str - Current value of the input field
   */

  const addKey = (str: string): void => {
    if (str.length > 31) {
      setValue(str);
    }
  };

  /**
   * Resets the {@link value} state to an empty string
   */

  const removeKey = (): void => {
    setValue('');
  };

  /**
   * Obfuscates the middle part of a string, showing the first 6 and last 4 characters
   * regardless of length
   * @param {string} str - The string to obfuscate
   * @return {string} Obfuscated version of {@link str}
   */

  const obfuscateKey = (str: string): string => {
    const first = str.substring(0, 6);
    const last = str.substring(str.length - 4, str.length);
    return `${first}....${last}`;
  };

  return (
    <>
      {value ? (
        <>
          <span>{secret ? obfuscateKey(value) : value}</span>
          <button
            onClick={removeKey}
            style={{ cursor: 'pointer' }}
            aria-label="Remove key"
          >
            Remove
          </button>
        </>
      ) : (
        <input
          type={secret ? 'password' : 'input'}
          placeholder="Insert your key here"
          defaultValue={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            addKey(e.target.value);
          }}
        />
      )}
    </>
  );
};

// DOCUMENTED
/**
 * KeyInput component receives value, setValue, secret and style props to render a key input field or a key text with a remove button.
 * @typedef {{
 *   value: string;
 *   setValue: any;
 *   secret: boolean;
 *   style: any;
 * }} KeyInputProps
 * @param {KeyInputProps} props - Destructured props for KeyInput component.
 * @returns {React.JSX.Element} - React component element to render.
 */
import React from 'react';

export const KeyInput = ({ value, setValue, secret, style }: KeyInputProps): React.JSX.Element => {
  /**
   * If a string is longer than 31 characters, set it as a value for the input field.
   * @param {string} str - String to be set as input field value
   */
  const addKey = (str: string): void => {
    // discount random key presses, could def have better sense checking
    // ethereum addresses are 42 chars
    if (str.length > 31) {
      setValue(str);
    }
  };

  /**
   * Set value prop's value as empty string.
   */
  const removeKey = (): void => {
    setValue('');
  };

  /**
   * Obfuscate part of a string to hide the sensitive information.
   * @param {string} str - String to be obfuscated.
   * @returns {string} - Obfuscated string.
   */
  const obfuscateKey = (str: string): string => {
    const first = str.substring(0, 6);
    const last = str.substring(str.length - 4, str.length);
    return `${first}....${last}`;
  };

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
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { addKey(e.target.value) }}
      placeholder="Insert your key here"
    />
  );
};

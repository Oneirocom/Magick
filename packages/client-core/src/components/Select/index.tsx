// GENERATED 
import React, { useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Creatable from 'react-select/creatable';
import ReactSelect, { SelectInstance, StylesConfig } from 'react-select';

import { Chip } from '../Chip';
import { Icon, componentCategories } from '../Icon';
import css from './select.module.css';

/**
 * Custom select component with support for creatable options and hotkeys.
 * 
 * @param {object} options - Options for the select component.
 * @param {function} onChange - Change event handler for select value change.
 * @param {string} placeholder - Placeholder text for the select component.
 * @param {string} defaultValue - Default value for the select component.
 * @param {object} style - Custom CSS styles.
 * @param {string} focusKey - Hotkey for focusing the select component.
 * @param {boolean} creatable - Enable/disable creating new options.
 * @param {boolean} nested - Flag to represent nested options.
 * @param {function} isValidNewOption - Validation function for newly created option.
 * @param {object} props - Additional props for the select component.
 */
export const Select = ({
  options,
  onChange,
  placeholder,
  defaultValue,
  style = {},
  focusKey = '',
  creatable = true,
  nested = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValidNewOption = (inputValue, selectValue, selectOptions, accessors) =>
    true,
  ...props
}) => {
  // Setup ref for select instance
  const selectRef = useRef<SelectInstance | null>(defaultValue);

  /**
   * Custom dropdown indicator.
   */
  const DropdownIndicator = () => {
    return props.searchable ? (
      <Icon name="search" size={16} />
    ) : (
      <div className={css['dropdown-indicator']}>❯</div>
    );
  };

  /**
   * Function to format group label.
   *
   * @param {object} data - Group data to be formatted.
   */
  const formatGroupLabel = data => (
    <span className={css['group-header']}>
      <Icon
        name={componentCategories[data.label]}
        style={{ marginRight: 'var(--extraSmall)' }}
      />
      {data.label}
    </span>
  );

  /**
   * Function to blur the select.
   */
  const blurSelect = () => {
    if (!selectRef.current) return;
    selectRef.current.blur();
  };

  // Setup hotkeys for enter and esc keys
  useHotkeys(
    'enter, esc',
    event => {
      event.preventDefault();
      blurSelect();
    },
    { enableOnTags: 'INPUT' as any },
    [blurSelect],
  );

  // Define styles for the select component
  const styles: StylesConfig<unknown, false, any> = {
    // ... add the styles object from the original code ...
  };

  return (
    <span style={style}>
      {options ? (
        <>
          {creatable && (
            <Creatable
              isClearable
              maxMenuHeight={150}
              options={options}
              onChange={onChange}
              styles={styles}
              defaultValue={defaultValue}
              placeholder={placeholder}
              components={{ DropdownIndicator }}
              isSearchable={props.searchable}
              ref={selectRef}
              formatGroupLabel={formatGroupLabel}
              {...props}
            />
          )}
          {!creatable && (
            <ReactSelect
              maxMenuHeight={150}
              options={options}
              onChange={onChange}
              styles={styles}
              value={defaultValue}
              placeholder={placeholder}
              components={{ DropdownIndicator }}
              ref={selectRef}
              {...props}
            />
          )}
        </>
      ) : (
        <Chip noEvents label={'No options available...'} />
      )}
    </span>
  );
};

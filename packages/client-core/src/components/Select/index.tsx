// GENERATED 
import React, { useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Creatable from 'react-select/creatable';
import ReactSelect, { SelectInstance, StylesConfig } from 'react-select';

import { Chip } from '../Chip';
import { Icon, componentCategories } from '../Icon';
import css from './select.module.css';

/**
 * Select component with customization options.
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
  const selectRef = useRef<SelectInstance | null>(defaultValue);

  /**
   * Dropdown indicator based on the searchable prop.
   */
  const DropdownIndicator = () => {
    return props.searchable ? (
      <Icon name="search" size={16} />
    ) : (
      <div className={css['dropdown-indicator']}>❯</div>
    );
  };

  /**
   * Format the group label with an icon and label.
   */
  const formatGroupLabel = (data) => (
    <span className={css['group-header']}>
      <Icon
        name={componentCategories[data.label]}
        style={{ marginRight: 'var(--extraSmall)' }}
      />
      {data.label}
    </span>
  );

  // Blurs the select when called
  const blurSelect = () => {
    if (!selectRef.current) return;
    selectRef.current.blur();
  };

  // Set up hotkeys (enter and esc) to exit the select
  useHotkeys(
    'enter, esc',
    (event) => {
      event.preventDefault();
      blurSelect();
    },
    { enableOnTags: 'INPUT' as any },
    [blurSelect]
  );

  // Styling configuration for the select component
  const styles: StylesConfig<unknown, false, any> = { /* styling code */ };

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
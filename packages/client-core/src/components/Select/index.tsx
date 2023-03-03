import React, { useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Creatable from 'react-select/creatable'
import ReactSelect, { SelectInstance, StylesConfig } from 'react-select'

import { Chip } from '../Chip'
import { Icon, componentCategories } from '../Icon'
import css from './select.module.css'

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
  const selectRef = useRef<SelectInstance | null>(defaultValue)

  const DropdownIndicator = () => {
    return props.searchable ? (
      <Icon name="search" size={16} />
    ) : (
      <div className={css['dropdown-indicator']}>❯</div>
    )
  }

  const formatGroupLabel = data => (
    <span className={css['group-header']}>
      <Icon
        name={componentCategories[data.label]}
        style={{ marginRight: 'var(--extraSmall)' }}
      />
      {data.label}
    </span>
  )

  const blurSelect = () => {
    if (!selectRef.current) return
    selectRef.current.blur()
  }

  useHotkeys(
    'enter, esc',
    event => {
      event.preventDefault()
      blurSelect()
    },
    { enableOnTags: 'INPUT' as any },
    [blurSelect]
  )

  const styles: StylesConfig<unknown, false, any> = {
    menu: () => ({
      backgroundColor: 'var(--dark-2)',
      borderRadius: 4,
      boxShadow: '0px 5px 5px rgba(0,0,0,0.3)',
      border: '1px solid var(--dark-3)',
      maxHeight: '200px',
      overflow: 'auto',
    }),
    menuPortal: () => ({
      height: 'var(--c2)',
    }),
    clearIndicator: () => ({
      backgroundColor: 'var(--primary)',
    }),
    option: (provided, state) => ({
      appearance: 'none',
      padding: 'var(--extraSmall)',
      paddingLeft: nested ? 'var(--large)' : 'var(--small)',
      paddingRight: 'var(--small)',
      backgroundColor: state.isFocused ? 'var(--primary)' : 'transparent',
      fontFamily: 'IBM Plex Mono',
    }),
    input: () => ({
      color: '#fff',
      backgroundColor: 'transparent',
      boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1) !important',
    }),

    control: (provided, state) => ({
      color: '#fff',
      backgroundColor: state.isFocused ? 'var(--dark-2)' : 'var(--dark-3)',
      borderRadius: 4,
      border:
        state.isFocused && focusKey
          ? '2px solid var(--primary)'
          : '1px solid var(--dark-4)',
      boxSizing: 'border-box',
      display: 'flex',
      boxShadow: state.isFocused
        ? 'inset 0px 5px 5px rgba(0, 0, 0, 0.1)'
        : '0px 2px 0px rgba(0, 0, 0, 0.2);',
      maxHeight: 'var(--c4)',
      minHeight: 'var(--c4)',
      paddingLeft: 'var(--small)',
      paddingRight: 'var(--small)',
    }),
    placeholder: (provided, state) => ({
      color: '#fff',
      position: 'absolute',
      fontFamily: '"IBM Plex Mono"',
      textTransform: 'uppercase',
      display: state.isFocused && focusKey ? 'none' : 'inline-block',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    valueContainer: () => ({
      width: '100%',
      display: 'flex',
      flex: '1',
      alignItems: 'center',
      fontFamily: 'IBM Plex Mono',
    }),
    singleValue: () => ({
      color: 'rgba(255,255,255)',
    }),
  }

  return (
    <span style={style}>
      {options ? (
        <>
          {creatable && (
            <Creatable
              isClearable
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
  )
}

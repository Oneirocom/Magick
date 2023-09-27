// DOCUMENTED
import * as React from 'react'
import { Icon } from '../Icon'
import css from './chip.module.css'

/**
 * Chip component properties.
 */
interface ChipProps {
  label: string
  onClick?: () => void
  noEvents?: boolean
}

/**
 * A Chip component.
 * @param {ChipProps} props - Properties to configure the chip component.
 * @returns {React.ReactElement} A Chip element with an optional close Icon.
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  onClick,
  noEvents,
}: ChipProps): React.ReactElement => {
  // Set the classNames for the chip component
  const classNames = `${css.chip} ${noEvents ? css['no-events'] : ''}`

  return (
    <div className={classNames} onClick={onClick}>
      {label}
      {!noEvents && <Icon name="close" />}
    </div>
  )
}

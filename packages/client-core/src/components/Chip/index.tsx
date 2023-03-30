import * as React from 'react'
import { Icon } from '../Icon'
import css from './chip.module.css'

export const Chip = ({
  label,
  onClick,
  noEvents,
}: {
  label: string
  onClick?: () => void
  noEvents?: boolean
}) => {
  return (
    <div
      className={`${css['chip']} ${noEvents && css['no-events']}`}
      onClick={onClick}
    >
      {label}
      {!noEvents && <Icon name="close" />}
    </div>
  )
}
import * as React from 'react'
import { Icon } from '@magickml/client-core'
import css from './chip.module.css'

export const Chip = ({
  label,
  onClick,
  noEvents,
}: {
  label: string
  onClick?: () => {}
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
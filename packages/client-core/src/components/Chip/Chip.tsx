import Icon from '../Icon/Icon'
import css from './chip.module.css'

const Chip = ({
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

export default Chip

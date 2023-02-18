import css from './toolbar.module.css'

const Toolbar = ({ ...props }) => {
  return (
    <div className={css['th-toolbar']}>
      <div className={css['toolbar-section']}>{props.toolbar}</div>
      <div className={css['toolbar-section']}>{props.options}</div>
    </div>
  )
}

export default Toolbar

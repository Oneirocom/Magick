import css from './window.module.css'

const WindowToolbar = props => {
  return <div className={css['window-toolbar']}>{props.children}</div>
}

export default WindowToolbar

import css from './panel.module.css'

const Panel = ({
  style = {},
  unpadded = false,
  shade = false,
  shadow = false,
  bacgkroundImageURL = '',
  hover = false,
  roundness = '',
  className = '',
  flexRow = false,
  flexColumn = false,
  gap = '',
  ...props
}) => {
  return (
    <div
      className={
        `${css['panel']} ${unpadded && css['unpadded']} ${
          shadow && css[shadow && 'shadow']
        } ${hover && css['hover']} ${css[roundness]} ${
          shade && css['shade-' + shade]
        } ` + className
      }
      style={{
        display: flexRow || flexColumn ? 'flex' : '',
        flexDirection: flexRow ? 'row' : 'column',
        gap: gap,
        backgroundImage: bacgkroundImageURL ? bacgkroundImageURL : undefined,
        ...style,
      }}
    >
      {props.children}
    </div>
  )
}

export default Panel

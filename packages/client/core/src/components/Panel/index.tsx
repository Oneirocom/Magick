// DOCUMENTED
import * as React from 'react'
import css from './panel.module.css'

/**
 * Panel component that uses CSS utility classes to customize the appearance.
 *
 * @param {{
 *   style: React.CSSProperties;
 *   unpadded: boolean;
 *   shade: boolean;
 *   shadow: boolean;
 *   backgroundImageURL: string;
 *   hover: boolean;
 *   roundness: string;
 *   className: string;
 *   flexRow: boolean;
 *   flexColumn: boolean;
 *   gap: string;
 *   children: React.ReactNode;
 * }} props - Props for the Panel component.
 */

export const Panel: React.FC<{
  style?: React.CSSProperties
  unpadded?: boolean
  shade?: boolean
  shadow?: boolean
  backgroundImageURL?: string
  hover?: boolean
  roundness?: string
  className?: string
  flexRow?: boolean
  flexColumn?: boolean
  gap?: string
  children?: React.ReactNode
}> = ({
  style = {},
  unpadded = false,
  shade = false,
  shadow = false,
  backgroundImageURL = '',
  hover = false,
  roundness = '',
  className = '',
  flexRow = false,
  flexColumn = false,
  gap = '',
  ...props
}) => {
  // Prepare class names
  const classNames = [
    css['panel'],
    unpadded && css['unpadded'],
    shadow && css[shadow && 'shadow'],
    hover && css['hover'],
    css[roundness],
    shade && css['shade-' + shade],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Prepare inline styles
  const inlineStyles: React.CSSProperties = {
    display: flexRow || flexColumn ? 'flex' : '',
    flexDirection: flexRow ? 'row' : 'column',
    backgroundImage: backgroundImageURL ? backgroundImageURL : undefined,
    ...style,
  }

  // Render the panel
  return (
    <div className={classNames} style={inlineStyles}>
      {props.children}
    </div>
  )
}

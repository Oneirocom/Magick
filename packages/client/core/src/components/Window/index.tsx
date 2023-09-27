// DOCUMENTED
import * as React from 'react'
import { ReactElement, useEffect, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'

import css from './window.module.css'

/**
 * A layout component to handle scrolling to the bottom.
 *
 * @param {object} props - The properties.
 * @param {boolean} props.scrollToBottom - If true, the content will scroll to bottom on change.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @return {ReactElement} The WindowLayout component.
 */
const WindowLayout: React.FC<{
  scrollToBottom: boolean
  children: React.ReactNode
}> = ({ scrollToBottom, children }) => {
  const scrollbars = useRef<any>()

  useEffect(() => {
    scrollbars.current.scrollToBottom()
  }, [scrollToBottom])

  return (
    <div className={css['window-layout']}>
      <Scrollbars ref={ref => (scrollbars.current = ref)}>
        {children}
      </Scrollbars>
    </div>
  )
}

type Props = {
  outline?: boolean
  dark?: boolean
  borderless?: boolean
  darker?: boolean
  grid?: boolean
  scrollToBottom?: boolean
  toolbar?: ReactElement<any, any> | false
  children: ReactElement<any, any> | ReactElement<any, any>[]
}

/**
 * A wrapper component for the window toolbar.
 *
 * @param {object} props - The properties.
 * @param {React.ReactNode} props.children - The content to be rendered within the toolbar.
 * @return {ReactElement} The WindowToolbar component.
 */
export const WindowToolbar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className={css['window-toolbar']}>{children}</div>
}

/**
 * A window component with optional styling and layout features.
 *
 * @param {Props} props - The properties.
 * @param {boolean} [props.outline=false] - If true, an outline will be added around the window.
 * @param {boolean} [props.dark=false] - If true, a dark background will be applied.
 * @param {boolean} [props.borderless=false] - If true, padding will be removed.
 * @param {boolean} [props.darker=false] - If true, a darker background will be applied.
 * @param {boolean} [props.grid=false] - If true, a grid layout will be applied.
 * @param {boolean} [props.scrollToBottom=false] - If true, will scroll to bottom on changes.
 * @param {ReactElement | false} [props.toolbar=false] - The toolbar component, if present.
 * @param {ReactElement | ReactElement[]} props.children - The content to be rendered within the window.
 * @return {ReactElement} The Window component.
 */
export const Window: React.FC<Props> = props => {
  const {
    outline = false,
    dark = false,
    borderless = false,
    darker = false,
    grid = false,
    toolbar = false,
    scrollToBottom = false,
  } = props

  return (
    <div
      className={`
      ${css['window']} 
      ${css[outline ? 'bordered' : '']} 
      ${css[dark ? 'darkened' : '']} 
      ${css[darker ? 'darker' : '']} 
      ${css[borderless ? 'unpadded' : '']}
      ${css[grid ? 'grid' : '']}
      `}
    >
      {toolbar && <WindowToolbar>{props.toolbar}</WindowToolbar>}
      <WindowLayout scrollToBottom={scrollToBottom}>
        {props.children}
      </WindowLayout>
    </div>
  )
}

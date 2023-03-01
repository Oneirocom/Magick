import * as React from 'react'
import { ReactElement, useEffect, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'

import css from './window.module.css'

const WindowLayout = ({ scrollToBottom, children }) => {
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
  lock?: ReactElement<any, any> | false
  children: ReactElement<any, any> | ReactElement<any, any>[]
}

export const WindowToolbar = props => {
  return <div className={css['window-toolbar']}>{props.children}</div>
}

export const Window = (props: Props) => {
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
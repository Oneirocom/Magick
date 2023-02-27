/* eslint-disable react/prop-types */
import React from 'react'

import { kebab } from './utils'

type SocketProps = {
  innerRef: (el: any, type: string, io: any) => void
  type: string
  io: any
  socket: {
    name: string
  }
}

export class Socket extends React.Component<SocketProps> {
  createRef = el => {
    const { innerRef, type, io } = this.props

    el && innerRef(el, type, io)
  }

  render() {
    const { socket, type } = this.props
    return (
      <div
        className={`socket ${type} ${kebab(socket.name)}`}
        title={socket.name}
        ref={el => this.createRef(el)} // force update for new IO with a same key
      />
    )
  }
}

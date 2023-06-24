// DOCUMENTED 
/**
 * Represents a draggable socket that can be connected to other sockets.
 */
import React from 'react';

import { kebab } from './utils';

type SocketProps = {
  /**
   * Ref function for getting the DOM element of the socket.
   * @param el The DOM element.
   * @param type The type of the socket.
   * @param io The IO instance.
   */
  innerRef: (el: HTMLDivElement | null, type: string, io: any) => void;
  /** The type of the socket. */
  type: string;
  /** The IO instance. */
  io: any;
  /** The socket's name. */
  socket: {
    name: string;
  };
};

export class Socket extends React.Component<SocketProps> {
  /**
   * Ref function that sets the ref to the inner div element.
   * @param el The DOM element.
   */
  createRef = (el: HTMLDivElement | null) => {
    const { innerRef, type, io } = this.props;

    el && innerRef(el, type, io);
  };

  render() {
    const { socket, type } = this.props;
    return (
      <div
        className={`socket ${type} ${kebab(socket.name)}`}
        title={socket.name}
        ref={this.createRef} // force update for new IO with a same key
      >
        <div className={`expanding ${kebab(socket.name)}`}></div>
      </div>
    );
  }
}
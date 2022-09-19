/* eslint-disable react/prop-types */
import React from 'react';
import { kebab } from './utils';

export class Socket extends React.Component {
    createRef = el => {
        const { innerRef, type, io } = this.props;
    
        el && innerRef(el, type, io);
    };

    render () {
        const { socket, type } = this.props;

        return (
            <div
                className={`socket ${type} ${kebab(socket.name)}`}
                title={socket.name}
                ref={el => this.createRef(el)} // force update for new IO with a same key 
            />
        )
    }
}
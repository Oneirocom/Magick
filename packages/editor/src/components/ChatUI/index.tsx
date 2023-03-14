import React from 'react';
import ChatMsg from './ChatMsg';
import { USER } from '../../../../../lib/constants';

const user = `${USER}:`
const DefaultChatMsg = ({ history }) => {
    return (
        <div>
            {history.map((msg, i) => {
                const side = msg.split(' ')[0] === user ? 'right' : 'left';
                return (
                    <ChatMsg
                        key={i}
                        avatar={msg.avatar}
                        // TODO: Separate messages by user with breakpoints
                        messages={[msg]}
                        side={side}
                    />
                );
            })
            }
        </div>
    );
}


export default DefaultChatMsg;
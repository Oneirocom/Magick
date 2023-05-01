

import React from 'react';
import cx from 'clsx';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material'
import ThumbDownAlt from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';

import styles from './styles.module.scss';
import { USER, AGENT } from '../../../../../../../../lib/constants';

const user = `${USER}:`
const agent = `${AGENT}:`

type ChatTypes = {
    avatar: string,
    messages: string[],
    side: 'left' | 'right',
}

// TODO: Move to lib
function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}
            ${name.split(' ')[1] ? name.split(' ')[1][0] : ' '}
        `,
    };
}

const AvatarItem = ({ avatar, name = 'Spell Magick' }) => {
    return (
        <Grid item xs={1}>
            <Avatar
                {...stringAvatar(name)}
                // src={avatar}
                // {...AvatarProps}
                className={styles.avatar}
            />
        </Grid>
    );
}

const onClick = () => {
    console.log('clicked')
}

// TODO: if user gave feedback show feedback
const Feedback = ({ messageId = '1' }) => {
    return (
        <Grid item xs={1}>
            <IconButton onClick={onClick}>
                <ThumbDownAlt fontSize="medium" />
            </IconButton>
            <IconButton onClick={onClick}>
                <ThumbUpAlt fontSize="medium" />
            </IconButton>
        </Grid>
    );
}

const MessageItem = ({ messages, side }) => {
    return (
        <Grid item xs={10}>
            {messages.map((msg, i) => {
                const message = msg.replace(user, '').replace(agent, '');
                return (
                    <div key={msg?.id || i}
                    >
                        <Typography
                            align={side}
                            className={styles.msg}
                        >
                            {message}
                        </Typography>
                    </div>
                );
            })}
        </Grid>
    );
};


const Message = ((props: ChatTypes) => {
    const {
        avatar,
        messages,
        side,
    } = props;

    return (
        <div>
            <Grid
                container
                spacing={2}
                // FIXME: Add justify prop to Grid
                // justify={side === 'right' ? 'flex-end' : 'flex-start'}
                className={cx(styles.row, styles[`${side}Row`])}
            >
                {side === 'left' ?
                    <>
                        <AvatarItem avatar={avatar} name='Magick Spell' />
                        <MessageItem messages={messages} side={side} />
                        <Feedback />
                    </> :
                    <>
                        <MessageItem messages={messages} side={side} />
                        <AvatarItem avatar={avatar} name="You" />
                        <Feedback />
                    </>
                }
            </Grid>
        </div>
    );
});

export default Message;
// require dotenv
const dotenv = require('dotenv-flow');
dotenv.config('../');

const path = require('path');

const isAgent = process.env.SERVER_TYPE === 'agent';

if (isAgent) {
    // call npm run start-agent async and print the logs
    const { spawn } = require('child_process');
    const child = spawn('npm', ['run', 'start-agent'], {
        cwd: path.join(__dirname, '../'),
        stdio: 'inherit',
    });
} else {
    // call npm run start-server async and print the logs
    const { spawn } = require('child_process');
    const child = spawn('npm', ['run', 'start-server'], {
        cwd: path.join(__dirname, '../'),
        stdio: 'inherit',
    });
}
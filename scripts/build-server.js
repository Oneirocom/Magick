// require dotenv
const dotenv = require('dotenv-flow');
dotenv.config('../');
const path = require('path');

const isAgent = process.env.SERVER_TYPE === 'agent';

// if is agent, call npx nx build @magickml/agent
if (isAgent) {
    // if agent, asynchrounously call npm run build-agent
    const { spawn } = require('child_process');
    const child = spawn('npx', ['nx', 'build', '@magickml/agent'], {
        cwd: path.join(__dirname, '../'),
        stdio: 'inherit',
    });
} else {
    // if server, asynchrounously call npm run build-server
    const { spawn } = require('child_process');
    const child = spawn('npx', ['nx', 'build', '@magickml/server'], {
        cwd: path.join(__dirname, '../'),
        stdio: 'inherit',
    });
}
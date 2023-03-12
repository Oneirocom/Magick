// require dotenv
const dotenv = require('dotenv-flow');
dotenv.config('../');

const path = require('path');

const isAgent = process.env.SERVER_TYPE === 'agent';

if (isAgent) {
    const agentPath = path.join(__dirname, '..', 'dist', 'apps', 'agent', 'main.js');
    require(agentPath);
}
else {
    const serverPath = path.join(__dirname, '..', 'dist', 'apps', 'server', 'main.js');
    require(serverPath);
}
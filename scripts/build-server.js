// require dotenv
const dotenv = require('dotenv-flow');
dotenv.config('../');

const isAgent = process.env.SERVER_TYPE === 'agent';

// if is agent, call npx nx build @magickml/agent
if (isAgent) {
    const { execSync } = require('child_process');
    // get the logs from the exec
    const logs = execSync('npx nx build @magickml/agent');
    // print the logs
    console.log(logs.toString());
} else {
    // if is server, call npx nx build @magickml/server
    const { execSync } = require('child_process');
    const logs = execSync('npx nx build @magickml/server');
    console.log(logs.toString());
}
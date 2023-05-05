// check if docker is running
const dockerStart = require('child_process').execSync('docker-compose up -d');
const path = require('path');
// check if node_modules exists
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, '../node_modules');
const nodeModulesExist = fs.existsSync(nodeModulesPath);

// check if package-lock.json or yarn.lock exist
const packageLockPath = path.resolve(__dirname, '../package-lock.json');
const packageLockExists = fs.existsSync(packageLockPath);

const yarnLockPath = path.resolve(__dirname, '../yarn.lock');
const yarnLockExists = fs.existsSync(yarnLockPath);

// check if ./.cache exists
const cachePath = path.resolve(__dirname, './.cache');
const cacheExists = fs.existsSync(cachePath);

const revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim()

let revisionChanged = false;

if (!cacheExists) {
    // write .cache file with revision
    fs.writeFileSync(cachePath, revision);
}

// read .cache file and compare to revision
const file = fs.readFileSync(cachePath, 'utf8');
if (file !== revision) {
    revisionChanged = true;
    fs.writeFileSync(cachePath, revision);
}

if (!nodeModulesExist || (!packageLockExists && !yarnLockExists) || revisionChanged) {
    console.log("New revision detected, installing dependencies...");
    const npmInstall = require('child_process').execSync('npm install --force');
    console.log(npmInstall.toString());
}
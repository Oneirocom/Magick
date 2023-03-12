const dotenv = require('dotenv-flow')
dotenv.config('../')

const os = require('os')

function configDb() {
  const dbType = process.env.DATABASE_TYPE
  const nodeEnv = process.env.NODE_ENV
  if (dbType === 'sqlite' && (!nodeEnv || nodeEnv === 'development')) {
    console.log('Running migrations for sqlite database')
    // run a process and call npm run migrate
    const { exec } = require('child_process')
    exec('npm run migrate', (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  }
}

function installDependenciesOnLinux() {
  // if we are on linux, we need to run sudo apt-get install -y libgomp1 libatlas-base-dev liblapack-dev 
  // dont forget ARM64 M1 macs
  const isLinux = os.platform() === 'linux'
  if (isLinux) {
    console.log('Installing dependencies for linux')
    const { exec } = require('child_process')
    exec('sudo apt-get install -y libgomp1 libatlas-base-dev liblapack-dev', (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  }
}

configDb()
installDependenciesOnLinux()
import { spawn } from 'child_process'
import * as fs from 'fs'
import path from 'path'
import os from 'os'

export default async function spawnPythonServer() {
  const _path = path.resolve(__dirname, '../../../pyserver') + '/main.py'
  if (!fs.existsSync(_path)) {
    console.error('Python server not found!')
    return
  }

  console.log('Spawning python server...')
  const p = os.platform()
  let pythonPath = 'python3'
  if (p === 'win32') {
    pythonPath = 'python'
  }

  const process = spawn(pythonPath, [_path])
  process.stdout.on('data', data => {
    console.log('>> ', data.toString())
  })
  process.stderr.on('data', data => {
    console.log('>> ', data.toString())
  })
  process.stdin.on('data', data => {
    console.log('>> ', data.toString())
  })
}

const https = require('https')
const fs = require('fs')
const { config } = require('dotenv-flow')
const path = require('path')

config()

const url =
  process.env.WHISPER_BIN_URI ||
  'https://whisper.ggerganov.com/ggml-model-whisper-tiny.en.bin'

https.get(url, res => {
  const assetsPath = path.resolve('assets')
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath)
  }

  const writeStream = fs.createWriteStream(path.resolve('assets/whisper.bin'))

  res.pipe(writeStream)

  writeStream.on('finish', () => {
    writeStream.close()
    console.log('Download Completed!')
  })
})

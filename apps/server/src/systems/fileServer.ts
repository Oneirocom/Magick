import https from 'https'
import http from 'http'
import * as fs from 'fs'
import path from 'path'

export async function initFileServer() {
  if (!fs.existsSync('files')) {
    console.log('FOLDER DIDNT EXIST AND CREATED')
    fs.mkdirSync('files')
  }

  if (process.env.USESSL === 'true') {
    const success = await initSSL()
    if (!success) {
      initNoSSL()
    }
  } else {
    await initNoSSL()
  }
  console.log('file server started on port:', process.env.FILE_SERVER_PORT)
}

async function initSSL(): Promise<boolean> {
  if (
    !fs.existsSync('certs') ||
    !fs.existsSync('certs/key.pem') ||
    !fs.existsSync('certs/cert.pem')
  ) {
    return false
  }

  https
    .createServer(
      {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem'),
      },
      function (req, res) {
        let filePath = '.' + req.url
        console.log('file requested:', filePath)
        if (filePath == './') {
          filePath = './index.html'
        }

        let extname = path.extname(filePath)
        let contentType = 'text/html'

        switch (extname) {
          case '.js':
            contentType = 'text/javascript'
            break
          case '.css':
            contentType = 'text/css'
            break
          case '.json':
            contentType = 'application/json'
            break
          case '.png':
            contentType = 'image/png'
            break
          case '.jpg':
            contentType = 'image/jpg'
            break
          case '.wav':
            contentType = 'audio/wav'
            break
          case '.mp3':
            contentType = 'audio/mp3'
            break
        }

        fs.readFile(filePath, function (error, content) {
          if (error) {
            if (error.code == 'ENOENT') {
              res.writeHead(404)
              res.end()
            } else {
              res.writeHead(500)
              res.end('error')
              res.end()
            }
          } else {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader(
              'Access-Control-Allow-Methods',
              'GET, POST, OPTIONS, PUT, PATCH, DELETE'
            )
            res.setHeader(
              'Access-Control-Allow-Headers',
              'X-Requested-With,content-type'
            )
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(content, 'utf-8')
          }
        })
      }
    )
    .listen(parseInt(process.env.FILE_SERVER_PORT as string))

  return true
}
async function initNoSSL() {
  http
    .createServer(function (req, res) {
      let filePath = '.' + req.url
      if (filePath == './') {
        filePath = './index.html'
      }

      let extname = path.extname(filePath)
      let contentType = 'text/html'

      switch (extname) {
        case '.js':
          contentType = 'text/javascript'
          break
        case '.css':
          contentType = 'text/css'
          break
        case '.json':
          contentType = 'application/json'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.jpg':
          contentType = 'image/jpg'
          break
        case '.wav':
          contentType = 'audio/wav'
          break
        case '.mp3':
          contentType = 'audio/mp3'
          break
      }

      fs.readFile(filePath, function (error, content) {
        if (error) {
          if (error.code == 'ENOENT') {
            res.writeHead(404)
            res.end()
          } else {
            res.writeHead(500)
            res.end('error')
            res.end()
          }
        } else {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE'
          )
          res.setHeader(
            'Access-Control-Allow-Headers',
            'X-Requested-With,content-type'
          )
          res.setHeader('Access-Control-Allow-Credentials', 'true')
          res.writeHead(200, { 'Content-Type': contentType })
          res.end(content, 'utf-8')
        }
      })
    })
    .listen(parseInt(process.env.FILE_SERVER_PORT as string))
}

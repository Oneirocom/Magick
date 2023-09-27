// DOCUMENTED
import { FILE_SERVER_PORT, USESSL } from 'shared/config'
import * as fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'
import sanitize from 'sanitize-filename'

/**
 * Initializes the file server with SSL enabled if configured.
 */
export async function initFileServer() {
  // Ensure the 'files' folder exists
  if (!fs.existsSync('files')) {
    console.warn('FOLDER DIDNT EXIST AND CREATED')
    fs.mkdirSync('files')
  }

  // Initialize the server with SSL if configured, otherwise without SSL
  if (USESSL) {
    const success = await initSSL()
    if (!success) {
      initNoSSL()
    }
  } else {
    await initNoSSL()
  }
  console.log('file server started on port:', FILE_SERVER_PORT)
}

/**
 * Initializes the file server with SSL enabled.
 * @returns {Promise<boolean>} - true if SSL is successfully enabled, false otherwise
 */
async function initSSL(): Promise<boolean> {
  // Check if the required SSL files exist
  if (
    !fs.existsSync('certs') ||
    !fs.existsSync('certs/key.pem') ||
    !fs.existsSync('certs/cert.pem')
  ) {
    return false
  }

  // Create HTTPS server with SSL enabled
  https
    .createServer(
      {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem'),
      },
      function (req, res) {
        let filePath = sanitize('.' + req.url) // Get the file path from the request URL
        if (filePath == './') {
          filePath = './index.html'
        }

        // Set content type based on file extension
        const extname = path.extname(filePath)
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

        // Read the requested file
        fs.readFile(filePath, function (error, content) {
          if (error) {
            if (error.code == 'ENOENT') {
              // Handle missing file
              res.writeHead(404)
              res.end()
            } else {
              // Handle server errors
              res.writeHead(500)
              res.end('error')
              res.end()
            }
          } else {
            // Send the file content with headers and content type
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
    .listen(FILE_SERVER_PORT)

  return true
}

/**
 * Initializes the file server without SSL enabled.
 */
async function initNoSSL() {
  // Create HTTP server
  http
    .createServer(function (req, res) {
      let filePath = sanitize('.' + req.url) // Get the file path from the request URL
      if (filePath == './') {
        filePath = './index.html'
      }

      // Set content type based on file extension
      const extname = path.extname(filePath)
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

      // Read the requested file
      fs.readFile(filePath, function (error, content) {
        if (error) {
          if (error.code == 'ENOENT') {
            // Handle missing file
            res.writeHead(404)
            res.end()
          } else {
            // Handle server errors
            res.writeHead(500)
            res.end('error')
            res.end()
          }
        } else {
          // Send the file content with headers and content type
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
    .listen(FILE_SERVER_PORT)
}

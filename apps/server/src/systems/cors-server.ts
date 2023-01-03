//@ts-ignore
import cors_proxy_https from 'cors-anywhere'
//@ts-ignore
import cors_proxy from 'cors-anywhere'
import * as fs from 'fs'

//CORs server that is used for the web client to request an agent's image from wikipedia
export class cors_server {
  static getInstance: cors_server

  constructor(port: number, host: string, ssl: boolean) {
    cors_server.getInstance = this

    if (ssl) {
      cors_proxy_https
        .createServer({
          httpsOptions: {
            key: fs.readFileSync('certs/key.pem'),
            cert: fs.readFileSync('certs/cert.pem'),
          },
          originWhitelist: [],
          requireHeader: ['origin', 'x-requested-with'],
          removeHeaders: ['cookie', 'cookie2'],
          redirectSameOrigin: true,
          httpProxyOptions: {
            // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
            xfwd: false,
          },
        })
        .listen(port, host, function () {
          console.log('Running CORS Anywhere on: https://' + host + ':' + port)
        })
    } else {
      cors_proxy
        .createServer({
          originWhitelist: [],
          requireHeader: ['origin', 'x-requested-with'],
          removeHeaders: ['cookie', 'cookie2'],
          redirectSameOrigin: true,
          httpProxyOptions: {
            // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
            xfwd: false,
          },
        })
        .listen(port, host, function () {
          console.log('Running CORS Anywhere on: http://' + host + ':' + port)
        })
    }
  }
}
export default cors_server

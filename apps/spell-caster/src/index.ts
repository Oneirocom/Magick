process.env.NODE_CONFIG_DIR = 'apps/spell-caster/config'
import 'regenerator-runtime/runtime'
import logger from './logger'
import app from './app'

const port = app.get('port')
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

server.then(() =>
  logger.info(
    'Feathers application started on http://%s:%d',
    app.get('host'),
    port
  )
)

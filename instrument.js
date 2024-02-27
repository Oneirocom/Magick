const { initSDK } = require('@hyperdx/node-opentelemetry')
const {
  BullMQInstrumentation,
} = require('@jenniferplusplus/opentelemetry-instrumentation-bullmq')
const {
  IORedisInstrumentation,
} = require('@opentelemetry/instrumentation-ioredis')
const { KoaInstrumentation } = require('@opentelemetry/instrumentation-koa')

initSDK({
  consoleCapture: true, // optional, default: true
  advancedNetworkCapture: true, // optional, default: false
  additionalInstrumentations: [
    new BullMQInstrumentation(),
    new IORedisInstrumentation(),
    new KoaInstrumentation(),
  ],
})

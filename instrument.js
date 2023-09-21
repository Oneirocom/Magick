const { initSDK } = require('@hyperdx/node-opentelemetry');

initSDK({
  consoleCapture: true, // optional, default: true
  advancedNetworkCapture: true, // optional, default: false
});

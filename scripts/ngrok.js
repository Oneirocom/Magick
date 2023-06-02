require('dotenv-flow').config();
const ngrok = require('ngrok');

(async function () {
  const authToken = process.env.NGROK_AUTH_TOKEN;

  if (!authToken) {
    console.error('NGROK_AUTH_TOKEN is not defined in the .env file');
    process.exit(1);
  }

  // Connect to ngrok with your auth token
  await ngrok.authtoken(authToken);

  // Start ngrok tunnel on port 3000 (you can change this to your desired port)
  const url = await ngrok.connect(3000);

  console.log(`ngrok tunnel started at ${url}`);
})().catch(error => {
  console.error('Error while starting ngrok:', error);
  process.exit(1);
});

// import ogs = require('open-graph-scraper')
const ogs = require('open-graph-scraper')

const options = {
  url: 'https://beta.magickml.com//',
}

async function getMeta() {
  const { error, html, result, response } = await ogs(options)
  console.log('result:', result) // This contains all of the Open Graph results
}

;(async () => {
  await getMeta()
})()

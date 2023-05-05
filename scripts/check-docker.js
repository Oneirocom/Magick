const tryV2 = () => {
  try {
    require('child_process').execSync('docker compose up -d')
  }
  catch (e) {
    console.log("docker v2 failed... trying v1")
    return false
  }
  return true
}

const tryV1 = () => {
  try {
    require('child_process').execSync('docker-compose up -d')
  }
  catch (e) {
    console.error("Docker compose failed with error: ", e)
  }
}

if (!tryV2()) {
  tryV1()
}

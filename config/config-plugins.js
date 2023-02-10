// check if packages/engine/plugins.json exists
// if it does, end the program
// if it doesn't exist, copy ./plugins.example.json to packages/engine/plugins.json
// end the program

const path = require('path');
const fs  = require('fs');
function copyExamplePluginsJson() {
  const pluginsJsonPath = path.join(__dirname, '..', 'packages', 'engine', 'plugins.json');
  const pluginsJsonExamplePath = path.join(__dirname, 'plugins.example.js');

  if (!fs.existsSync(pluginsJsonPath)) {
    fs.copyFileSync(pluginsJsonExamplePath, pluginsJsonPath);
  }
}

copyExamplePluginsJson();
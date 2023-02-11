// check if packages/engine/plugins.json exists
// if it does, end the program
// if it doesn't exist, copy ./plugins.example.json to packages/engine/plugins.json
// end the program

const path = require('path');
const fs  = require('fs');
const plugins = require('./plugins.example.js');
function copyExamplePluginsJson() {
  const pluginsJsPath = path.join(__dirname, '..', 'packages', 'engine', 'plugins.ts');

  let i = 0;

  let importString = 'const plugins = {}\n';
  for (const plugin of plugins) {
    importString += `import {default as plugin${i}} from '${plugin}';\nplugins['${plugin}'] = plugin${i};\n`;
    i++;
  }
  importString += 'export default plugins;';

  if (!fs.existsSync(pluginsJsPath)) {
    // write importString to pluginsJsPath
    fs.writeFileSync(pluginsJsPath, importString);
  }
}

copyExamplePluginsJson();
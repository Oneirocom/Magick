const dotenv = require('dotenv');
dotenv.config('../');

console.log('Installation plugins', process.env.PLUGINS)

const plugins = process.env.PLUGINS ? process.env.PLUGINS.split(',') : [];

const path = require('path');
const fs  = require('fs');
function copyExamplePluginsJson() {
  const pluginsJsPath = path.join(__dirname, '..', 'packages', 'engine', 'src/plugins.ts');

  let i = 0;

  let importString = 'const plugins = {}\n';
  for (const plugin of plugins) {
    importString += `import {default as plugin${i}} from '${plugin}';\nplugins['${plugin}'] = plugin${i};\n`;
    i++;
  }
  importString += 'export default plugins;';

  fs.writeFileSync(pluginsJsPath, importString);
}

copyExamplePluginsJson();
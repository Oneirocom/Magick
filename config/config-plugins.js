const dotenv = require('dotenv-flow');
dotenv.config('../');

console.log('Installation plugins', process.env.PLUGINS)

const plugins = process.env.PLUGINS ? process.env.PLUGINS.split(',') : [];

const path = require('path');
const fs  = require('fs');
function copyExamplePluginsJson() {
  const pluginsJsPathClient = path.join(__dirname, '..', 'apps', 'client', 'src/plugins.ts');
  const pluginsJsPathServer = path.join(__dirname, '..', 'apps', 'server', 'src/plugins.ts');
  const pluginsJsPathAgent = path.join(__dirname, '..', 'apps', 'agent', 'src/plugins.ts');

  let i = 0;

  let importString = 'const plugins = {}\n';
  for (const plugin of plugins) {
    importString += `import {default as plugin${i}} from '${plugin}';\nplugins['${plugin}'] = plugin${i};\n`;
    i++;
  }
  importString += 'export default plugins;';

  fs.writeFileSync(pluginsJsPathClient, importString);
  fs.writeFileSync(pluginsJsPathServer, importString);
  fs.writeFileSync(pluginsJsPathAgent, importString);
}

copyExamplePluginsJson();
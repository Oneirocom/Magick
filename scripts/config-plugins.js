try {
  const dotenv = require('dotenv-flow')
} catch {
  console.log(
    '`npm install` is likely running with `--dry-run` or `---package-lock-only` flags. Exiting.'
  )
  process.exit(0)
}
dotenv.config('../');

console.log('Server plugins', process.env.SERVER_PLUGINS)
console.log('Client plugins', process.env.CLIENT_PLUGINS)

const serverPlugins = process.env.SERVER_PLUGINS ? process.env.SERVER_PLUGINS.split(',').map(
  (plugin) => {
    return `@magickml/plugin-${plugin}-server`;
  }
) : [];
const clientPlugins = process.env.CLIENT_PLUGINS ? process.env.CLIENT_PLUGINS.split(',').map(
  (plugin) => {
    return `@magickml/plugin-${plugin}-client`;
  }
) : [];

const path = require('path');
const fs  = require('fs');

const pluginsJsPathClient = path.join(__dirname, '..', 'apps', 'client', 'src/plugins.ts');
const pluginsJsPathServer = path.join(__dirname, '..', 'apps', 'server', 'src/plugins.ts');
const pluginsJsPathAgent = path.join(__dirname, '..', 'apps', 'agent', 'src/plugins.ts');

function copyExamplePluginsJson() {

  let i = 0;

  let importString = 'const plugins = {}\n';
  for (const plugin of serverPlugins) {
    importString += `import {default as plugin${i}} from '${plugin}';\nplugins['${plugin}'] = plugin${i};\n`;
    i++;
  }
  importString += 'export default plugins;';

  fs.writeFileSync(pluginsJsPathServer, importString);
  fs.writeFileSync(pluginsJsPathAgent, importString);

  importString = 'const plugins = {}\n';
  for (const plugin of clientPlugins) {
    importString += `import {default as plugin${i}} from '${plugin}';\nplugins['${plugin}'] = plugin${i};\n`;
    i++;
  }
  importString += 'export default plugins;';

  fs.writeFileSync(pluginsJsPathClient, importString);

}

copyExamplePluginsJson();
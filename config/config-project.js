// check if packages/engine/plugins.json exists
// if it does, end the program
// if it doesn't exist, copy ./plugins.example.json to packages/engine/plugins.json
// end the program

const path = require('path');
const fs  = require('fs');
const uuid = require('uuid').v4;

function configProject() {
  const pluginsJsPath = path.join(__dirname, '..', 'packages', 'engine', 'project.js');
  const pluginsJsExamplePath = path.join(__dirname, 'project.example.js');

  const projectId = uuid();

  if (!fs.existsSync(pluginsJsPath)) {
    // read the example file as utf8
    const exampleFile = fs.readFileSync(pluginsJsExamplePath, 'utf8');
    // replace the text {uuid} with a uuid
    const newFile = exampleFile.replace('{uuid}', projectId);
    // write the new file
    fs.writeFileSync(pluginsJsPath, newFile);
  }
}

configProject();
const fs = require('fs')
const path = require('path')

const templates = {
  spells: [],
  projects: [],
}

// get all json files in the ../spells directory, read them, and add them to the spells array
const spells = fs
  .readdirSync(path.join(__dirname, './spells'))
  .filter(file => file.endsWith('.json'))
for (const spell of spells) {
  const spellData = fs.readFileSync(
    path.join(__dirname, './spells', spell),
    'utf8'
  )
  templates.spells.push(JSON.parse(spellData))
}

// get all json files in the ../projects directory, read them, and add them to the projects array
const projects = fs
  .readdirSync(path.join(__dirname, './projects'))
  .filter(file => file.endsWith('.json'))
for (const project of projects) {
  const projectData = fs.readFileSync(
    path.join(__dirname, './projects', project),
    'utf8'
  )
  templates.projects.push(JSON.parse(projectData))
}

const stringified = JSON.stringify(templates, null, 2)

const exportString = `export default ${stringified}`

fs.writeFileSync(path.join(__dirname, './src/templates.ts'), exportString)
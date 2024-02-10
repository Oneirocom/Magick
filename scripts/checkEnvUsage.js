const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

// Function to read and parse .env files
const parseEnvFile = filePath => {
  try {
    const envContents = fs.readFileSync(filePath, 'utf-8')
    return dotenv.parse(envContents)
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err)
    return {}
  }
}

// Combine variables from .env and .env.local
const envVars = {
  ...parseEnvFile('.env'),
  ...parseEnvFile('.env.local'),
}

// Convert object keys to array for easier processing
const envKeys = Object.keys(envVars)

const ignoredFiles = [
  'node_modules',
  'pythonPackages',
  '.env',
  '.env.local',
  'docs',
  'dist',
  '.git',
  '.nx',
  '.next',
  'coverage',
  'build',
  'out',
  'public',
  'scripts',
  'src',
  'test',
  'tmp',
  'vendor',
  'yarn-error.log',
  'yarn.lock',
  'package-lock.json',
  'tsconfig.base.json',
  'tsconfig.json',
  'tsconfig.spec.json',
  'tsconfig.app.json',
  'tsconfig.e2e.json',
  'tsconfig.lib.json',
  'tsconfig.schematics.json',
  'tsconfig.tools',
]

// Function to search through all files in a directory recursively
const searchEnvUsage = (dir, callback) => {
  console.log('CHECKING KEYS', envKeys)
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(`Error reading directory ${dir}:`, err)
      return
    }
    files.forEach(file => {
      if (ignoredFiles.includes(file.name)) {
        return
      }

      const filePath = path.join(dir, file.name)

      if (file.isDirectory()) {
        searchEnvUsage(filePath, callback) // Recurse into subdirectories
      } else {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.log(`Error reading file ${filePath}:`, err)
            return
          }
          callback(filePath, data)
        })
      }
    })
  })
}

// Store unused env variables initially with all as unused
let unusedEnvVars = new Set(envKeys)

// Start searching for usage
console.log('Searching for environment variable usage...')
searchEnvUsage(path.join(__dirname, '..'), (filePath, fileContents) => {
  unusedEnvVars.forEach(envVar => {
    const regex = new RegExp(envVar)
    if (fileContents.match(envVar)) {
      console.log('ENV FOUND', envVar, filePath)
      unusedEnvVars.delete(envVar) // Remove used variables from the set
    }
  })
})

// Output results after a delay to ensure async operations complete
setTimeout(() => {
  if (unusedEnvVars.size > 0) {
    console.log('Unused environment variables found:')
    unusedEnvVars.forEach(varName => console.log(varName))
  } else {
    console.log('All environment variables are used.')
  }
}, 3000) // Adjust timeout as needed based on project size

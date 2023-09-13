const fs = require('fs')
const path = require('path')

const IGNORED_FOLDERS = ['node_modules', 'dist', 'database', 'logs'] // Add other folder names to this array as needed

/**
 * Check if a directory should be ignored during traversal.
 * @param {string} dirName - Name of the directory.
 * @returns {boolean} - True if the directory should be ignored, false otherwise.
 */
function shouldIgnore(dirName) {
  return IGNORED_FOLDERS.includes(dirName)
}

/**
 * Recursively traverse a directory looking for "nodes" directories.
 * @param {string} dir - The starting directory.
 */
function searchForNodesDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    if (shouldIgnore(file)) continue // Skip ignored directories

    let filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      if (file === 'nodes') {
        traverseAndPrint(filePath)
      } else {
        searchForNodesDirectory(filePath)
      }
    }
  }
}

/**
 * Traverse a directory and print the file names without the .ts extension.
 * @param {string} dir - The starting directory.
 * @param {string} parent - Parent directory name.
 */
function traverseAndPrint(dir, parent = '') {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    let filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      traverseAndPrint(filePath, file)
    } else {
      let filenameWithoutExtension = path.basename(file, '.ts')
      console.log(parent + '/' + filenameWithoutExtension)
    }
  }
}

const folderPath = '.' // Change to your folder path
searchForNodesDirectory(folderPath)

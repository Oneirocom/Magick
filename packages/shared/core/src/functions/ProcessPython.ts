// DOCUMENTED
import { loadPyodide } from 'pyodide'
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/'

const isBrowser = typeof window !== 'undefined'

let pyodide

/**
 * Run Python code using Pyodide and return the result.
 *
 * @param {string} code - The Python code to run.
 * @param {Record<string, any>} entry - The input values for the Python code.
 * @param {any} data - Additional data to pass to the Python code.
 * @returns {Promise<any>} The result of the executed Python code.
 */
export async function runPython(code, entry, data) {
  // Load Pyodide if not already loaded
  if (!pyodide) {
    pyodide = await loadPyodide({
      indexURL: isBrowser ? PYODIDE_URL : undefined,
    })
  }

  // Set Python globals from the entry input values
  for (const [key, value] of Object.entries(entry)) {
    pyodide.globals.set(key, value)
  }
  pyodide.globals.set('data', data)

  // Run the Python code and convert the result to JavaScript
  const codeResult = await pyodide.runPython(code)

  const toJsResult = codeResult.toJs()
  const codeResultJS =
    toJsResult[0] instanceof Map
      ? convertMapToObject(toJsResult[0])
      : toJsResult[0]
  const dataResult =
    toJsResult[1] instanceof Map
      ? convertMapToObject(toJsResult[1])
      : toJsResult[1]

  // Return the results in a single JavaScript object
  const result = { ...codeResultJS, data: dataResult }

  return result
}

/**
 * Convert a Map to a plain JavaScript object, recursively.
 *
 * @param {Map<string, any>} inputMap - The input Map to convert.
 * @returns {Record<string, any>} The plain JavaScript object.
 */
function convertMapToObject(inputMap) {
  const outputObject = {}
  for (const [key, value] of inputMap) {
    if (value instanceof Map) {
      outputObject[key] = convertMapToObject(value)
    } else {
      outputObject[key] = value
    }
  }
  return outputObject
}

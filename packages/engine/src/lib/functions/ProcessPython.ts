// import { loadPyodide } from "pyodide";
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.22.0/full/";

const isBrowser = typeof window !== "undefined";

let pyodide;

export default async function runPython (code, entry, data) {
  // inputs renamed to entry for python insertion
  if(!pyodide) {
    return { data: data, error: "Pyodide not loaded" };
    // pyodide = await loadPyodide({
    //   indexURL: isBrowser ? PYODIDE_URL : undefined,
    // })
  }

  for (const [key, value] of Object.entries(entry)) {
    pyodide.globals.set(key, value);
  }
  pyodide.globals.set("data" , data);
  
  
  let codeResult = pyodide.runPython(code);

  let toJsResult = codeResult.toJs();
  let codeResultJS = toJsResult[0] instanceof Map ? convertMapToObject(toJsResult[0]) : toJsResult[0];
  let dataResult = toJsResult[1] instanceof Map ? convertMapToObject(toJsResult[1]) : toJsResult[1];

  const result = {...codeResultJS, data: dataResult};

  return result;
};


function convertMapToObject(inputMap) {
  let outputObject = {};
  for (let [key, value] of inputMap) {
      if (value instanceof Map) {
          outputObject[key] = convertMapToObject(value);
      } else {
          outputObject[key] = value;
      }
  }
  return outputObject;
}

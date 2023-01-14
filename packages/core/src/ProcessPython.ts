import { loadPyodide } from "pyodide";
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.22.0/full/";

const isBrowser = typeof window !== "undefined";

let pyodide;
loadPyodide({
  indexURL: isBrowser ? PYODIDE_URL : undefined,
}).then((_pyodide) => {
  console.log("Pyodide loaded");
  pyodide = _pyodide;
});

export default async function runPython (code) {
  if(!pyodide) {
    throw new Error("Pyodide not loaded");
  }

	return await pyodide.runPythonAsync(code);
};
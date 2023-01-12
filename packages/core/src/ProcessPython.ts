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

export default async function run_python (code) {
  if(!pyodide) {
    throw new Error("Pyodide not loaded");
  }

	return await pyodide.runPythonAsync(code);
};


// import { useEffect } from 'react'

// const run_python = url => {
//   useEffect(() => {
//     const script = document.createElement('script');

//     script.src = url;
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     }
//   }, [url]);
// };

// export default run_python;

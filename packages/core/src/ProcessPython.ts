import { loadPyodide } from "pyodide";

export default async function run_python(code) {
  console.log(code);
  let loaded = await loadPyodide();
  const codeResult = loaded.runPython("1 + 1");
  console.log('run_python code', codeResult)  
}



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

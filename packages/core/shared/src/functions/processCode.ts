// DOCUMENTED
import { MagickWorkerInputs, SupportedLanguages, UnknownData } from '../types'
import { runPython } from './ProcessPython'
import ivm from 'isolated-vm'
let vm2

/**
 * Dynamically import vm2 if process is not undefined.
 */
if (typeof process !== 'undefined') {
  ;(async () => {
    vm2 = await import('vm2')
  })()
}

/**
 * Process the code based on the given inputs.
 * @param code - The code to process.
 * @param inputs - The input values for the code.
 * @param data - The data values required for processing the code.
 * @param language - The supported language for processing the code. Default is `javascript`.
 * @returns The result of processing the code.
 */
export async function processCode(
  code: unknown,
  inputs: MagickWorkerInputs,
  data: UnknownData,
  language: SupportedLanguages = 'javascript'
) {
  // Flatten inputs before injecting them for a better code experience
  const flattenInputs = Object.entries(inputs).reduce(
    (acc, [key, value]: [string, unknown]) => {
      if (!value)
        throw new TypeError('Input value is undefined or null: ' + key)
      acc[key] = value[0]
      return acc
    },
    {} as UnknownData
  )

  if (language === 'javascript') {
    const isolate = new ivm.Isolate({ memoryLimit: 32 }) // Create a new sandbox/isolate limited to 32MB
    const context = isolate.createContextSync()
    const jail = context.global //Will hold variables and functions required in the isolate

    jail.setSync('data', new ivm.Reference(data, { unsafeInherit: true }))
    jail.setSync(
      'input',
      new ivm.Reference(flattenInputs, { unsafeInherit: true })
    )
    // const { VM } = vm2
    // const vm = new VM()

    // // Freeze the variables being injected into the VM
    // vm.freeze(data, 'data')
    // vm.freeze(flattenInputs, 'input')

    // Run the code
    const codeToRun = `
      "use strict"; 
      function runFn(input,data){ 
        return (${code})(input,data)
      }; 
      input = input.copySync();
      data = data.copySync();
      runFn(input,data);
    `

    try {
      const script = await isolate.compileScript(codeToRun)
      const codeResult = await script.run(context).catch(err => {
        console.error('Error in Isolate : ' + err)
      })
      // const codeResult = vm.run(codeToRun)
      console.log('CODE RESULT', codeResult)
      return codeResult
    } catch (err) {
      console.log({ err })
      return 'Error in spell runner: processCode component: ' + code
    }
  } else {
    try {
      const codeResult = await runPython(code, flattenInputs, data)
      return codeResult
    } catch (err) {
      console.log({ err })
    }
  }
}

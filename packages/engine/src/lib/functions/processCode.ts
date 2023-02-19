import { MagickWorkerInputs } from '../types';
// import vm2 from 'vm2';
import runPython from '../functions/ProcessPython';

export async function processCode(
  code: unknown,
  inputs: MagickWorkerInputs,
  data: Record<string, any>,
  language: string = 'javascript'
) {
  // Inputs are flattened before we inject them for a better code experience
  const flattenInputs = Object.entries(inputs).reduce(
    (acc, [key, value]: [string, any]) => {
      acc[key] = value[0];
      return acc;
    },
    {} as Record<string, any>
  );

  if (language === 'javascript') {
    // const { VM } = vm2;
    // const vm = new VM();

    // // Freeze the variables we are injecting into the VM
    // vm.freeze(data, 'data');
    // vm.freeze(flattenInputs, 'input');

    // // run the code
    // const codeToRun = `"use strict"; function runFn(input,data){ return (${code})(input,data)}; runFn(input,data);`;

    // try {
    //   const codeResult = vm.run(codeToRun);
    //   console.log('CODE RESULT', codeResult);
    //   return codeResult;
    // } catch (err) {
    //   console.log({ err });
    //   throw new ServerError(
    //     'server-error',
    //     'Error in spell runner: processCode component: ' + code
    //   );
    // }
  } else {
    try {

      const codeResult = await runPython(code, flattenInputs, data);
      return codeResult;
    } catch (err) {
      console.log({ err });
    }
  }
}

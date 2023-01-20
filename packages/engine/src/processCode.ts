import { MagickWorkerInputs } from '@magickml/engine';
import vm2 from 'vm2';
import { runPython } from '@magickml/engine';
import { CustomError } from '../../../apps/server/src/utils/CustomError';


export async function processCode(
  code: unknown,
  inputs: MagickWorkerInputs,
  data: Record<string, any>,
  state: Record<string, any>,
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
    const { VM } = vm2;
    const vm = new VM();

    // Freeze the variables we are injecting into the VM
    vm.freeze(data, 'data');
    vm.freeze(flattenInputs, 'input');
    vm.protect(state, 'state');

    // run the code
    const codeToRun = `"use strict"; function runFn(input,data,state){ return (${code})(input,data,state)}; runFn(input,data,state);`;

    try {
      const codeResult = vm.run(codeToRun);
      console.log('CODE RESULT', codeResult);
      return codeResult;
    } catch (err) {
      console.log({ err });
      throw new CustomError(
        'server-error',
        'Error in spell runner: processCode component: ' + code
      );
    }
  } else {
    try {

      const codeResult = await runPython(code, flattenInputs, data, state);
      return codeResult;
    } catch (err) {
      console.log({ err });
    }
  }
}

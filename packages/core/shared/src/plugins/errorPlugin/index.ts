// DOCUMENTED 
import { MagickComponent } from '../../engine';
import { IRunContextEditor, MagickNode } from '../../types';
import { MagickConsole } from '../consolePlugin/MagickConsole';

/**
 * Installs the error plugin to the provided engine.
 * @param {IRunContextEditor} engine - The engine to install the plugin for.
 * @param {{ server?: boolean, throwError?: (error: unknown) => void }} options - Optional settings.
 * @param {boolean} [options.server] - If true, the plugin is installed in server mode.
 * @param {(error: unknown) => void} [options.throwError] - Error throwing function to use instead of the default.
 */
function install(
  engine: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: (error: unknown) => void }
): void {
  engine.on(
    'error',
    ({ message, data }: { message: string; data: MagickNode }) => {
      // Obtain the component from the engine
      const component = engine.components.get(
        data.name as string
      ) as unknown as MagickComponent<unknown>;

      // If the component doesn't exist, return early
      if (!component) return;

      // Create a new MagickConsole instance
      const console = new MagickConsole({
        node: data,
        component,
        editor: engine,
        server,
        throwError,
        isEngine: true,
      });

      // Handle recursion errors
      if (message === 'Recursion detected') {
        const error = new Error(`Recursion occurred in node ID ${data.id}`);

        console.error(error);
      }
    }
  );
}

const defaultExport = {
  name: 'errorPlugin',
  install,
};

export default defaultExport;
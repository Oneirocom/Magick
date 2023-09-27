// DOCUMENTED
/**
 * Globals Manager is a singleton class that allows registration of global variables that can be accessed from anywhere in the codebase.
 *
 * This is useful for things like the editor, which needs to be accessible from anywhere in the codebase.
 *
 * TODO: This pattern is fine for now, but we should probably use a dependency injection through the interface or something.
 */
class GlobalsManager {
  private globals: Map<string, unknown>

  constructor() {
    this.globals = new Map()
  }

  /**
   * Register a new global variable with the given name and value.
   *
   * @param name - The name of the global variable to be added.
   * @param value - The value of the global variable to be added.
   */
  register(name: string, value: unknown): void {
    this.globals.set(name, value)
  }

  /**
   * Get the value of a previously registered global variable.
   *
   * @param name - The name of the global variable whose value is to be retrieved.
   * @returns The value of the requested global variable, or undefined if no such variable has been registered.
   */
  get(name: string): unknown {
    return this.globals.get(name)
  }
}

// Export a singleton instance of the GlobalsManager class
export const globalsManager = new GlobalsManager()

export type Constructor<T = any> = new (...args: any[]) => T

export class DIContainer {
  private dependencies: Map<string, any> = new Map()

  register<T>(key: string, implementation: T): void {
    this.dependencies.set(key, implementation)
  }

  resolve<T>(key: string): T {
    const dependency = this.dependencies.get(key)
    if (!dependency) {
      throw new Error(`Dependency ${String(key)} not found`)
    }
    return dependency
  }
}

export interface ISpellCaster {
  initialize(): Promise<void>
  dispose(): Promise<void>
  handleEvent(eventName: string, data: any): void
}

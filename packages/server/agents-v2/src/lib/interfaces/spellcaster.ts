export interface ISpellCaster {
  handleEvent(event: any): void
  dispose(): Promise<void>
}

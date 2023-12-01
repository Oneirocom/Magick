export interface Reporter {
  on(event: string, callback: (data: unknown) => any): void
}

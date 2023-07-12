export interface Reporter {
    on(event: string, callback: (state: string) => any): void
}

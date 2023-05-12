export interface Reporter {
    on(event: string, callback: (event: any) => Promise<void>): void
}

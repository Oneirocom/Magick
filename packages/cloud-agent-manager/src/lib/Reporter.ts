import { EventEmitter } from 'events'

export interface Reporter {
    on(event: string, callback: (state: string) => any): void
}

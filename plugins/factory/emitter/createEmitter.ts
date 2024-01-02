import { EventEmitter } from 'events'
import TypedEmitter from 'typed-emitter'

type Events<T> = {
  [K in keyof T]: (event: T[K]) => void
}

// Generic emitter creation function
export function createEmitter<T>(): TypedEmitter<Events<T>> {
  return new EventEmitter() as TypedEmitter<Events<T>>
}

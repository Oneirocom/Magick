import { TypedEmitter } from 'tiny-typed-emitter'
import {
  DefaultListener,
  EventName,
  IEventEmitter,
  ListenerSignature,
} from '../interfaces/IEventEmitter'

export class EventEmitterWrapper<
  L extends ListenerSignature<L> = DefaultListener
> implements IEventEmitter<L>
{
  protected emitter: IEventEmitter<L>
  private anyListeners: Set<
    (event: Extract<keyof L, EventName>, ...args: any[]) => void
  >

  constructor(emitter?: IEventEmitter<L>) {
    this.emitter = emitter || new TypedEmitter<L>()
    this.anyListeners = new Set()
  }

  addListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this {
    this.emitter.addListener(event, listener)
    return this
  }

  on<U extends Extract<keyof L, EventName>>(event: U, listener: L[U]): this {
    this.emitter.on(event, listener)
    return this
  }

  once<U extends Extract<keyof L, EventName>>(event: U, listener: L[U]): this {
    this.emitter.once(event, listener)
    return this
  }

  prependListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this {
    this.emitter.prependListener(event, listener)
    return this
  }

  prependOnceListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this {
    this.emitter.prependOnceListener(event, listener)
    return this
  }

  removeListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this {
    this.emitter.removeListener(event, listener)
    return this
  }

  off<U extends Extract<keyof L, EventName>>(event: U, listener: L[U]): this {
    this.emitter.off(event, listener)
    return this
  }

  removeAllListeners(event?: Extract<keyof L, EventName>): this {
    this.emitter.removeAllListeners(event)
    return this
  }

  setMaxListeners(n: number): this {
    this.emitter.setMaxListeners(n)
    return this
  }

  getMaxListeners(): number {
    return this.emitter.getMaxListeners()
  }

  listeners<U extends Extract<keyof L, EventName>>(event: U): L[U][] {
    return this.emitter.listeners(event)
  }

  rawListeners<U extends Extract<keyof L, EventName>>(event: U): L[U][] {
    return this.emitter.rawListeners(event)
  }

  emit<U extends Extract<keyof L, EventName>>(
    event: U,
    ...args: Parameters<L[U]>
  ): boolean {
    this.anyListeners.forEach(listener => listener(event, ...args))
    return this.emitter.emit(event, ...args)
  }

  eventNames<U extends Extract<keyof L, EventName>>(): U[] {
    return this.emitter.eventNames() as U[]
  }

  listenerCount(type: Extract<keyof L, EventName>): number {
    return this.emitter.listenerCount(type)
  }

  onAny(
    listener: (event: Extract<keyof L, EventName>, ...args: any[]) => void
  ): this {
    if (this.emitter.onAny) {
      this.emitter.onAny(listener)
    } else {
      this.anyListeners.add(listener)
    }

    return this
  }

  offAny(
    listener: (event: Extract<keyof L, EventName>, ...args: any[]) => void
  ): this {
    if (this.emitter.offAny) {
      this.emitter.offAny(listener)
    } else {
      this.anyListeners.delete(listener)
    }
    return this
  }
}

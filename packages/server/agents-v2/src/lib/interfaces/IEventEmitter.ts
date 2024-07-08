export type EventName = string | symbol

export type ListenerSignature<L> = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [E in Extract<keyof L, EventName>]: (...args: any[]) => any
}

export type DefaultListener = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [k: string]: (...args: any[]) => any
}

export interface IEventEmitter<
  L extends ListenerSignature<L> = DefaultListener
> {
  addListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this
  on<U extends Extract<keyof L, EventName>>(event: U, listener: L[U]): this
  once<U extends Extract<keyof L, EventName>>(event: U, listener: L[U]): this
  prependListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this
  prependOnceListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this
  removeListener<U extends Extract<keyof L, EventName>>(
    event: U,
    listener: L[U]
  ): this
  off<U extends Extract<keyof L, EventName>>(event: U, listener: L[U]): this
  removeAllListeners(event?: Extract<keyof L, EventName>): this
  setMaxListeners(n: number): this
  getMaxListeners(): number
  listeners<U extends Extract<keyof L, EventName>>(event: U): L[U][]
  rawListeners<U extends Extract<keyof L, EventName>>(event: U): L[U][]
  emit<U extends Extract<keyof L, EventName>>(
    event: U,
    ...args: Parameters<L[U]>
  ): boolean
  eventNames<U extends Extract<keyof L, EventName>>(): U[]
  listenerCount(type: Extract<keyof L, EventName>): number

  // Add our custom methods
  onAny?(
    listener: (event: Extract<keyof L, EventName>, ...args: any[]) => void
  ): this
  offAny?(
    listener: (event: Extract<keyof L, EventName>, ...args: any[]) => void
  ): this
}

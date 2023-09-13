import { Connection, Input, Output } from '@magickml/rete'

export interface EventsTypes {
  connectionpath: {
    points: number[]
    connection: Connection
    d: string
  }
  connectiondrop: Input | Output
  connectionpick: Input | Output
  resetconnection: void
}

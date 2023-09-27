import { Connection, Input, Output } from 'shared/rete'

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

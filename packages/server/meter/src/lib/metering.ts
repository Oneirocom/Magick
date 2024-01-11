import { v4 as uuidv4 } from 'uuid'
import { getLogger } from 'packages/server/logger/src'
import { OPENMETER } from 'packages/shared/config/src'
import { Event } from '@openmeter/sdk'

export type MeterData = Record<
  string,
  string | number | Record<string, string | number>
>

export interface IMeterManager {
  meterAction(event: string, data: MeterData): Promise<void>
}

export type Meters = Record<string, IMeterManager>

export class MeterManager implements IMeterManager {
  private meterClient: any
  private logger = getLogger()
  private agentId: string
  private meters: Meters = {}

  constructor(agentId: string) {
    this.agentId = agentId
    this.initializeOpenMeter()
  }

  async initializeOpenMeter(): Promise<void> {
    // theres a weird bug when importing regularly:
    //    Error [ERR_REQUIRE_ESM]: require() of ES Module magick/node_modules/@openmeter/sdk/dist/index.js
    const openMeterModule = await import('@openmeter/sdk')
    this.meterClient = new openMeterModule.OpenMeter({
      baseUrl: OPENMETER.endpoint,
      token: OPENMETER.token,
    })
  }

  initializeMeters(m: Meters): void {
    this.meters = m
  }

  async meterAction(event: string, data: MeterData): Promise<void> {
    if (!OPENMETER.enabled) {
      return
    }

    const meterEvent: Event = {
      specversion: '1.0',
      id: uuidv4(),
      source: OPENMETER.source,
      type: event,
      subject: this.agentId,
      datacontenttype: 'application/json',
      time: new Date(),
      data,
    }

    try {
      await this.meterClient.events.ingest(meterEvent)
    } catch (error) {
      this.logger.error('Error while metering action:', error)
    }
  }
}

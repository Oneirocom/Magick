// DOCUMENTED
/**
 * For more information about this file see
 * https://dove.feathersjs.com/guides/cli/service.class.html#database-services
 */
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import type { Application } from '../../declarations'
import type {
  Request,
  RequestData,
  RequestPatch,
  RequestQuery,
} from './requests.schema'

export type RequestParams = KnexAdapterParams<RequestQuery>

interface RequestRow {
  timestamp: number
  request_count: number
  total_cost: number
  total_requests: number
}

export interface AnalyticsParams extends Params {
  query: {
    agentId: string
  }
}

/**
 * By default calls the standard Knex adapter service methods but can be
 * customized with your own functionality.
 * @template ServiceParams - Extends the Params for better typing
 */
export class RequestService<
  ServiceParams extends Params = RequestParams
> extends KnexService<Request, RequestData, ServiceParams, RequestPatch> {
  static app: Application

  constructor(options: KnexAdapterOptions, app: Application) {
    super(options)
    RequestService.app = app
  }

  /**
   * Get the analytics for the given agentId
   * @param params - the params object
   * @returns - the analytics for the given agentId
   * @memberof RequestService
   * @static
   */
  static async analytics(params: AnalyticsParams) {
    const { agentId } = params.query
    const db = RequestService.app.get('dbClient')

    const currentTime = new Date()
    const startOfDay = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate()
    )
    const timeIntervals = [] as Date[]
    // Generating time intervals from the start of the day to the current time
    for (
      let i = startOfDay.getTime();
      i <= currentTime.getTime();
      i += 3600000
    ) {
      // 1 hour interval
      timeIntervals.push(new Date(i))
    }

    const currentYear = currentTime.getFullYear()
    const currentMonth = currentTime.getMonth() + 1

    // Calculate the start and end of the current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1)
    const endOfMonth = new Date(currentYear, currentMonth, 0)

    // Query to get the total cost and total number of requests for the current month
    const monthQuery = db('request')
      .select(
        db.raw('sum(cost) as total_cost'),
        db.raw('count(*) as total_requests')
      )
      .where('agentId', `${agentId}`)
      .whereBetween('createdAt', [startOfMonth, endOfMonth])

    // The query to get the today's requests and costs series
    const query = db('request')
      .select(
        db.raw('EXTRACT(EPOCH FROM "createdAt") * 1000 as timestamp'),
        db.raw('COUNT(*) as request_count'),
        db.raw('SUM(cost) as total_cost')
      )
      .where('agentId', `${agentId}`)
      .whereBetween('createdAt', [startOfDay, currentTime])
      .groupByRaw('EXTRACT(EPOCH FROM "createdAt")')
      .orderBy('timestamp')

    // todo fizx this type error.
    // @ts-ignore
    const result = (await Promise.all([query, monthQuery])) as Array<
      Array<RequestRow>
    >

    const requestSeries = new Array(result[0].length)
    const costSeries = new Array(result[0].length)
    let spentToday = 0
    let requestsToday = 0

    // Calculating and formatting monthly data
    result[0].forEach((row: RequestRow, index: number) => {
      spentToday += +row.total_cost
      requestsToday += +row.request_count

      requestSeries[index] = [+row.timestamp, +row.request_count]
      costSeries[index] = [+row.timestamp, row.total_cost]
    })

    return {
      requestSeries,
      costSeries,
      spentToday,
      requestsToday,
      monthlyCost: result[1][0].total_cost,
      monthlyRequest: +result[1][0].total_requests,
    }
  }
}

/**
 * Get options for the RequestService
 * @param app - the Application object
 * @returns KnexAdapterOptions for the RequestService
 */
export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: {
      default: 1000,
      max: 1000,
    },
    Model: app.get('dbClient'),
    name: 'request',
    multi: true,
  }
}

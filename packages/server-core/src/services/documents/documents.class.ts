// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  DocumentData,
  DocumentPatch,
  DocumentQuery,
} from './documents.schema'
import { app } from '../../app'

export type DocumentParams = KnexAdapterParams<DocumentQuery>

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class DocumentService<
  ServiceParams extends Params = DocumentParams
> extends KnexService<Document, DocumentData, ServiceParams, DocumentPatch> {
  
  //@ts-ignore
  async create(data: DocumentData): Promise<any> {
    if (process.env.DATABASE_TYPE == 'pg'){
      const db = app.get('dbClient')
      //@ts-ignore
      let {id, ...rest} = data;
      let cli = app.get('docdb')
      await cli.from('document').insert(data);
      //let _ = await db('events').insert(data);
    }
    return data
  }

  async remove(id: string): Promise<any> {
    if (process.env.DATABASE_TYPE == 'sqlite'){
      const docdb = app.get('docdb')
      const r = docdb.delete(id)
      return r
    } else{
      const db = app.get('dbClient');
      let _ = await db('document').where('id', id).del();
      return _
    }
    
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async find(params?: ServiceParams) {
    const db = app.get('dbClient')
    let cli = app.get('docdb')
    if (process.env.DATABASE_TYPE == 'sqlite'){
      const docdb = app.get('docdb')
      if (params.query.embedding) {
        const blob = atob(params.query.embedding)
        const ary_buf = new ArrayBuffer(blob.length)
        const dv = new DataView(ary_buf)
        for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i))
        const f32_ary = new Float32Array(ary_buf)
        const query = f32_ary as unknown as number[]
        const { $limit: _, ...param } = params.query
        let search_result = await docdb.extractMetadataFromResults(query, 2, param)
        if (search_result) {
          return { data: search_result }
        }
      }
      const { $limit: _, ...param } = params.query
      let tr = await docdb.getDataWithMetadata(param, 10);
      return { data: tr }
    } else {
       if (params.query.embedding) {
          const blob = atob(params.query.embedding)
          const ary_buf = new ArrayBuffer(blob.length)
          const dv = new DataView(ary_buf)
          for (let i = 0; i < blob.length; i++) dv.setUint8(i, blob.charCodeAt(i))
          const f32_ary = new Float32Array(ary_buf)
          const query = f32_ary as unknown as number[]
          const { $limit: _, ...param } = params.query
          let querys = await db('events').select('*')
          .where(
            {
              ...(param.type && {'type': param.type}),
              ...(param.id && {'id': param.id}),
              ...(param.sender && {'sender': param.sender}),
              ...(param.client && {'client': param.client}),
              ...(param.channel && {'channel': param.channel}),
              ...(param.projectId && {'projectId': param.projectId}),
              ...(param.content && {'content': param.content})
          })
          .orderByRaw(`embedding <-> ${"'[" + f32_ary.toString() + "]'"}`)
          let result = await db.raw(`select * from events order by embedding <-> ${"'[" + f32_ary.toString() + "]'"} limit 1;`)
          let bod = {query_embedding: "[" + f32_ary.toString() + "]", match_count: 2, content_to_match: "hi"}
          let rr = await cli.rpc("match_events",bod)
          console.log(rr)
          return {data: querys}
       }
       let res = await super.find(params);
       return {data: (res as unknown as {data: Array<any>}).data};
    }
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('dbClient'),
    name: 'documents'
  }
}

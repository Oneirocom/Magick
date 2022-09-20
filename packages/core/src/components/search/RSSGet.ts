process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'
//@ts-ignore
import xmldoc from 'xmldoc'

import { NodeData, ThothNode } from '../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, arraySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'RSS Get is used to get a json array from an RSS feed, you can use RSS1|RSS2|...|RSSN to use more links, also the Fetch Way can be left to empty to get the data from all RSS feeds or rnd/random to get randomly from one from the list'

type WorkerReturn = {
  output: any[]
}

export class RSSGet extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('RSS Get')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Search'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', arraySocket)

    const feedUrl = new InputControl({
      dataKey: 'feed_url',
      name: 'Feed URL',
    })
    const toDocument = new BooleanControl({
      dataKey: 'to_document',
      name: 'To Document',
    })
    const fetchWay = new BooleanControl({
      dataKey: 'fetch_way',
      name: 'Fetch Way',
    })

    node.inspector.add(feedUrl).add(toDocument).add(fetchWay)

    return node.addInput(dataInput).addOutput(dataOutput).addOutput(output)
  }

  async worker(node: NodeData) {
    const feed_url = node?.data?.feed_url as string
    const to_document = node?.data?.to_document
    const fetch_way = node?.data?.fetch_way as string

    if (feed_url === undefined || !feed_url || feed_url?.length <= 0) {
      return {
        output: [],
      }
    }

    const url = feed_url.split('|')
    let urls: any[] = []

    if (url.length === 1) {
      urls.push(url[0])
    } else {
      if (fetch_way === 'random' || fetch_way === 'rnd') {
        urls.push(url[Math.floor(Math.random() * url.length)])
      } else {
        urls = url
      }
    }
    const data: any[] = []
    for (let i = 0; i < urls.length; i++) {
      let resp: any = undefined
      try {
        resp = await axios.get(urls[i])
      } catch (e) {
        resp = await axios.get(process.env.REACT_APP_CORS_URL + '/' + urls[i])
      }

      if (
        !resp ||
        resp === undefined ||
        resp?.data === undefined ||
        !resp.data ||
        resp.data?.length <= 0
      ) {
        continue
      }

      if (isJson(resp.data)) {
        if (to_document === true || to_document === 'true') {
          for (let i = 0; i < resp.data.items.length; i++) {
            const object = {
              title: resp.data.items[i].title,
              description: resp.data.items[i].content_html
                .replace('<br>', '\\n')
                .replace('</p>', '\\n')
                .replace(/<[^>]*>?/gm, ''),
            }
            data.push(object)
          }
        } else {
          for (let i = 0; i < resp.data.items.length; i++) {
            data.push(resp.data.items[i])
          }
        }
      } else {
        const doc = new xmldoc.XmlDocument(resp.data)
        const _data = doc.children[0].children
        if (!_data) {
          continue
        }

        for (let i = 0; i < _data.length; i++) {
          let title = ''
          let description = ''
          for (let j = 0; j < _data[i].children.length; j++) {
            if (_data[i].children[j]?.name === 'title') {
              title = _data[i].children[j].val
            } else if (_data[i].children[j]?.name === 'description') {
              description = _data[i].children[j].val
            }
          }

          if (title?.length > 0 && description?.length > 0) {
            data.push({ title: title, description: description })
          }
        }
      }
    }

    return {
      output: data,
    }
  }
}

function isJson(str: any) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

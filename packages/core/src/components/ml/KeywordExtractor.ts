/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import keyword_extractor from 'keyword-extractor'
import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { triggerSocket, anySocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Keyword Extractor is used to extract keywords from an input'

type WorkerReturn = {
  output: any
}

export class KeywordExtractor extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Keyword Extractor')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const input = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    const onlyKeywords = new BooleanControl({
      dataKey: 'onlyKeywords',
      name: 'Only Keywords',
    })

    node.inspector.add(onlyKeywords)

    return node
      .addInput(input)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
    const action = inputs['string'][0] as string
    const onlyKeywords = node.data?.onlyKeywords as string

    const keywords = await keywordExtractor(action, onlyKeywords == 'true')

    return {
      output: keywords,
    }
  }
}

async function keywordExtractor(input: string, onlyKeywords: boolean) {
  const keywords: any[] = []

  const res = keyword_extractor.extract(input, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  })

  if (res.length == 0) {
    return []
  }

  const resp = await axios.post(
    `${import.meta.env.VITE_APP_API_URL}/hf_request`,
    {
      inputs: input,
      model: 'flair/pos-english',
      parameters: [],
      options: undefined,
    }
  )

  const { success, data } = resp.data

  if (!success) {
    return []
  }

  for (let i = 0; i < res.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].word === res[i]) {
        if (data[j].entity_group === 'NN' || data[j].entity_group === 'NNS') {
          keywords.push(res[i])
          break
        }
      }
    }
  }
  if (keywords.length === 0) {
    return []
  }

  let totalLength = 0
  const respp: any[] = []
  for (let i = 0; i < keywords.length; i++) {
    const _resp = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/weaviate`,
      {
        keyword: keywords[i],
      }
    )

    const weaviateResponse = _resp.data
    if (weaviateResponse.length === 0 || !weaviateResponse.Paragraph) {
      continue
    }

    if (weaviateResponse.Paragraph.length > 0) {
      const modelResp = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/hf_request`,
        {
          inputs: weaviateResponse.Paragraph[0].content,
          model: 'facebook/bart-large-cnn',
          parameters: [],
          options: undefined,
        }
      )

      const { success, data } = modelResp.data
      if (!success) {
        continue
      }

      const sum = data

      if (sum && sum.length > 0) {
        totalLength += sum[0].summary_text.length
        if (totalLength > 1000) {
          return keywords
        }
        if (onlyKeywords) {
          respp.push(keywords[i])
        } else {
          respp.push({ word: keywords[i], info: sum[0].summary_text })
        }
      }
    }
  }
  return respp
}
export default keywordExtractor

export function simpleExtractor(input: string) {
  return keyword_extractor.extract(input, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  })
}

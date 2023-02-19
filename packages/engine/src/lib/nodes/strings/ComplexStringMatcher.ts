/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info =
  'Complex String Matcher uses basic string matches to determine if the input matches some selected properties'

export class ComplexStringMatcher extends MagickComponent<Promise<void>> {
  constructor() {
    super('Complex String Matcher')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Strings'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    // checkbox for [must match] and [dont match]

    // list of words to match beginning

    const matchBeginningString = new InputControl({
      dataKey: 'matchBeginningString',
      name: 'Match Beginning (, separated)',
    })

    const notMatchBeginningString = new InputControl({
      dataKey: 'notMatchBeginningString',
      name: 'Invalidate Beginning (, separated)',
    })

    const matchEndString = new InputControl({
      dataKey: 'matchEndString',
      name: 'Match End (, separated)',
    })

    const notMatchEndString = new InputControl({
      dataKey: 'notMatchEndString',
      name: 'Invalidate End (, separated)',
    })

    const matchAnyString = new InputControl({
      dataKey: 'matchAnyString',
      name: 'Match Any (, separated)',
    })

    const notMatchAnyString = new InputControl({
      dataKey: 'notMatchAnyString',
      name: 'Invalidate Any (, separated)',
    })

    const stringMinLength = new NumberControl({
      dataKey: 'stringMinLength',
      name: 'Minimum String Length (0 to ignore)',
    })

    const stringMaxLength = new NumberControl({
      dataKey: 'stringMaxLength',
      name: 'Maximum String Length (0 to ignore)',
    })

    node.inspector
      .add(nameControl)
      .add(matchBeginningString)
      .add(notMatchBeginningString)
      .add(matchEndString)
      .add(notMatchEndString)
      .add(matchAnyString)
      .add(notMatchAnyString)
      .add(stringMinLength)
      .add(stringMaxLength)

    const inp = new Rete.Input('input', 'Input', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    // implement a function that replaces all instances of a string with another string
    const replaceAll = (str: string, find: string, replace: string) => {
      return str.toString().replace(new RegExp(find, 'g'), replace)
    }

    let input = inputs['input'][0] as string
    console.log('input:::::', input)
    const str = input + ''
    const i1 = str.toString().replace(/<.*>/, '')

    console.log('input:::::', i1)

    input = replaceAll(
      replaceAll(i1.replace(/ /, ''), '"', ''),
      "'",
      ''
    ).toLowerCase()
    console.log('input:::::', input)

    const stringMinLength = (node.data.stringMinLength ?? 0) as number
    const stringMaxLength = (node.data.stringMaxLength ?? 0) as number

    const matchBeginningStringArray = (
      (node.data.matchBeginningString ?? '') as string
    )
      .toLowerCase()
      .split(', ')
    if (
      matchBeginningStringArray.length > 0 &&
      matchBeginningStringArray[0] === ''
    ) {
      matchBeginningStringArray.pop()
    }

    const matchEndStringArray = ((node.data.matchEndString ?? '') as string)
      .toLowerCase()
      .split(', ')

    if (matchEndStringArray.length > 0 && matchEndStringArray[0] === '') {
      matchEndStringArray.pop()
    }

    const matchAnyStringArray = ((node.data.matchAnyString ?? '') as string)
      .toLowerCase()
      .split(', ')

    if (matchAnyStringArray.length > 0 && matchAnyStringArray[0] === '') {
      matchAnyStringArray.pop()
    }

    const notMatchBeginningStringArray = (
      (node.data.notMatchBeginningString ?? '') as string
    )
      .toLowerCase()
      .split(', ')
    if (
      notMatchBeginningStringArray.length > 0 &&
      notMatchBeginningStringArray[0] === ''
    ) {
      notMatchBeginningStringArray.pop()
    }

    const notMatchEndStringArray = (
      (node.data.notMatchEndString ?? '') as string
    )
      .toLowerCase()
      .split(', ')

    if (notMatchEndStringArray.length > 0 && notMatchEndStringArray[0] === '') {
      notMatchEndStringArray.pop()
    }

    const notMatchAnyStringArray = (
      (node.data.notMatchAnyString ?? '') as string
    )
      .toLowerCase()
      .split(', ')

    if (notMatchAnyStringArray.length > 0 && notMatchAnyStringArray[0] === '') {
      notMatchAnyStringArray.pop()
    }

    let isMatched = false
    let invalidated = false

    function matchStart(inp: string, matchArray: string[]) {
      for (const matchString of matchArray) {
        if (inp.startsWith(matchString)) {
          return true
        }
      }
      return false
    }

    function match(inp: string, matchArray: string[]) {
      for (const matchString of matchArray) {
        if (inp.includes(matchString)) {
          return true
        }
      }
      return false
    }

    function matchEnd(inp: string, matchArray: string[]) {
      for (const matchString of matchArray) {
        if (inp.endsWith(matchString)) {
          return true
        }
      }
      return false
    }

    if (stringMaxLength !== 0) {
      if (
        input.length > stringMaxLength ||
        input.length < (stringMinLength ?? 0)
      ) {
        invalidated = true
      }
    }

    if (matchBeginningStringArray.length > 0) {
      const matched = matchStart(input, matchBeginningStringArray)
      if (matched) {
        // console.log('matched beginning')
        isMatched = true
      }
    }

    if (matchEndStringArray.length > 0) {
      const matched = matchEnd(input, matchEndStringArray)
      if (matched) {
        // console.log('matched beginning')
        isMatched = true
      } else {
        isMatched = false
      }
    }
    if (matchAnyStringArray.length > 0) {
      const matched = match(input, matchAnyStringArray)
      if (matched) {
        // console.log('matched beginning')
        isMatched = true
      } else {
        isMatched = false
      }
    }

    if (notMatchBeginningStringArray.length > 0) {
      const matched = matchStart(input, notMatchBeginningStringArray)
      if (matched) {
        invalidated = true
      }
    }

    if (!invalidated && notMatchEndStringArray.length > 0) {
      const matched = matchEnd(input, notMatchEndStringArray)
      if (matched) {
        invalidated = true
      }
    }
    if (!invalidated && notMatchAnyStringArray.length > 0) {
      const matched = match(input, notMatchAnyStringArray)
      if (matched) {
        invalidated = true
      }
    }

    if (!silent)
      node.display('isMatched: ' + isMatched + ' | invalidated: ' + invalidated)

    this._task.closed = !invalidated && isMatched ? ['false'] : ['true']
  }
}

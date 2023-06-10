import Rete from 'rete'

import { InputControl } from '../../dataControls/InputControl'
// import { NumberControl } from '../../dataControls/NumberControl'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

const info =
  'Takes a string input and applies a series of text rule checks specified (match beginning, match end, match any, minimum/maximum length) then triggers one of two outputs if all the rules are satisfied. Empty rule properties are ignored.'

export class ComplexStringMatcher extends MagickComponent<Promise<void>> {
  constructor() {
    super(
      'Text Rule Matcher',
      {
        outputs: { true: 'option', false: 'option' },
      },
      'Text',
      info
    )
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

    // const notMatchBeginningString = new InputControl({
    //   dataKey: 'notMatchBeginningString',
    //   name: 'Invalidate Beginning (, separated)',
    // })

    const matchEndString = new InputControl({
      dataKey: 'matchEndString',
      name: 'Match End (, separated)',
    })

    // const notMatchEndString = new InputControl({
    //   dataKey: 'notMatchEndString',
    //   name: 'Invalidate End (, separated)',
    // })

    const matchAnyString = new InputControl({
      dataKey: 'matchAnyString',
      name: 'Match Any (, separated)',
    })

    // const notMatchAnyString = new InputControl({
    //   dataKey: 'notMatchAnyString',
    //   name: 'Invalidate Any (, separated)',
    // })

    // const stringMinLength = new NumberControl({
    //   dataKey: 'stringMinLength',
    //   name: 'Minimum String Length (0 to ignore)',
    //   defaultValue: 0,
    // })

    // const stringMaxLength = new NumberControl({
    //   dataKey: 'stringMaxLength',
    //   name: 'Maximum String Length (0 to ignore)',
    //   defaultValue: 0,
    // })

    node.inspector
      .add(nameControl)
      .add(matchBeginningString)
      .add(matchEndString)
      .add(matchAnyString)
      // .add(notMatchBeginningString)
      // .add(notMatchEndString)
      // .add(notMatchAnyString)
      // .add(stringMinLength)
      // .add(stringMaxLength)

    const inp = new Rete.Input('input', 'Input', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    // add an input for each of the inspector properties

    const matchBeginningInput = new Rete.Input(
      'matchBeginning',
      'Match Beginning',
      stringSocket
    )

    // const invalidateBeginning = new Rete.Input(
    //   'invalidateBeginning',
    //   'Invalidate Beginning',
    //   stringSocket
    // )

    const matchEnd = new Rete.Input('matchEnd', 'Match End', stringSocket)

    // const invalidateEnd = new Rete.Input(
    //   'invalidateEnd',
    //   'Invalidate End',
    //   stringSocket
    // )

    const matchAny = new Rete.Input('matchAny', 'Match Any', stringSocket)
    // const invalidateAny = new Rete.Input(
    //   'invalidateAny',
    //   'Invalidate Any',
    //   stringSocket
    // )

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(isTrue)
      .addOutput(isFalse)

      .addInput(matchBeginningInput)
      // .addInput(invalidateBeginning)
      .addInput(matchEnd)
      // .addInput(invalidateEnd)
      .addInput(matchAny)
      // .addInput(invalidateAny)
  }

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ) {
    // implement a function that replaces all instances of a string with another string
    const replaceAll = (str: string, find: string, replace: string) => {
      return str.toString().replace(new RegExp(find, 'g'), replace)
    }

    let input = inputs['input'][0] as string
    const matchBeginning =
      (inputs['matchBeginning'] as string[]) &&
      (inputs['matchBeginning'][0] as string)
    // const invalidateBeginning =
    //   (inputs['invalidateBeginning'] as string[]) &&
    //   (inputs['invalidateBeginning'][0] as string)
    const matchEnd =
      (inputs['matchEnd'] as string[]) && (inputs['matchEnd'][0] as string)
    // const invalidateEnd =
    //   (inputs['invalidateEnd'] as string[]) &&
    //   (inputs['invalidateEnd'][0] as string)
    const matchAny =
      (inputs['matchAny'] as string[]) && (inputs['matchAny'][0] as string)
    // const invalidateAny =
    //   (inputs['invalidateAny'] as string[]) &&
    //   (inputs['invalidateAny'][0] as string)

    const str = input + ''
    const i1 = str.toString().replace(/<.*>/, '')

    input = replaceAll(
      replaceAll(i1.replace(/ /, ''), '"', ''),
      "'",
      ''
    ).toLowerCase()

    const stringMinLength = (node.data.stringMinLength ?? 0) as number
    const stringMaxLength = (node.data.stringMaxLength ?? 0) as number

    const matchBeginningStringArray = (
      (matchBeginning ?? node.data.matchBeginningString ?? '') as string
    )
      .toLowerCase()
      .split(', ')
    if (
      matchBeginningStringArray.length > 0 &&
      matchBeginningStringArray[0] === ''
    ) {
      matchBeginningStringArray.pop()
    }

    const matchEndStringArray = (
      matchEnd ?? ((node.data.matchEndString ?? '') as string)
    )
      .toLowerCase()
      .split(', ')

    if (matchEndStringArray.length > 0 && matchEndStringArray[0] === '') {
      matchEndStringArray.pop()
    }

    const matchAnyStringArray = (
      matchAny ?? ((node.data.matchAnyString ?? '') as string)
    )
      .toLowerCase()
      .split(', ')

    if (matchAnyStringArray.length > 0 && matchAnyStringArray[0] === '') {
      matchAnyStringArray.pop()
    }

    // const notMatchBeginningStringArray = (
    //   invalidateBeginning ??
    //   ((node.data.notMatchBeginningString ?? '') as string)
    // )
    //   .toLowerCase()
    //   .split(', ')
    // if (
    //   notMatchBeginningStringArray.length > 0 &&
    //   notMatchBeginningStringArray[0] === ''
    // ) {
    //   notMatchBeginningStringArray.pop()
    // }

    // const notMatchEndStringArray = (
    //   invalidateEnd ?? ((node.data.notMatchEndString ?? '') as string)
    // )
    //   .toLowerCase()
    //   .split(', ')

    // if (notMatchEndStringArray.length > 0 && notMatchEndStringArray[0] === '') {
    //   notMatchEndStringArray.pop()
    // }

    // const notMatchAnyStringArray = (
    //   invalidateAny ?? ((node.data.notMatchAnyString ?? '') as string)
    // )
    //   .toLowerCase()
    //   .split(', ')

    // if (notMatchAnyStringArray.length > 0 && notMatchAnyStringArray[0] === '') {
    //   notMatchAnyStringArray.pop()
    // }

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

    function matchEndString(inp: string, matchArray: string[]) {
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
        //
        isMatched = true
      }
    }

    if (matchEndStringArray.length > 0) {
      const matched = matchEndString(input, matchEndStringArray)
      if (matched) {
        //
        isMatched = true
      } else {
        isMatched = false
      }
    }
    if (matchAnyStringArray.length > 0) {
      const matched = match(input, matchAnyStringArray)
      if (matched) {
        //
        isMatched = true
      } else {
        isMatched = false
      }
    }

    // if (notMatchBeginningStringArray.length > 0) {
    //   const matched = matchStart(input, notMatchBeginningStringArray)
    //   if (matched) {
    //     invalidated = true
    //   }
    // }

    // if (!invalidated && notMatchEndStringArray.length > 0) {
    //   const matched = matchEndString(input, notMatchEndStringArray)
    //   if (matched) {
    //     invalidated = true
    //   }
    // }
    // if (!invalidated && notMatchAnyStringArray.length > 0) {
    //   const matched = match(input, notMatchAnyStringArray)
    //   if (matched) {
    //     invalidated = true
    //   }
    // }

    this._task.closed =
    !invalidated &&
    isMatched ? ['false'] : ['true']
  }
}
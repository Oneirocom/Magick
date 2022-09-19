/* eslint-disable no-console */
/* eslint-disable camelcase */
const getPreamble = (data, serialization) => {
  const parts = []
  parts.push(serialization.introduction)
  for (const d of data) {
    for (let i = 0; i < d.inputs.length; ++i) {
      parts.push(serialization.beforeEachInput[i])
      parts.push(d.inputs[i])
    }
    parts.push(serialization.inBetween)
    for (let i = 0; i < d.outputs.length; ++i) {
      parts.push(serialization.beforeEachOutput[i])
      parts.push(d.outputs[i])
    }
    parts.push(serialization.atTheEnd)
  }
  return parts.join('')
}

export const getPrompt = (inputs, data, serialization) => {
  const parts = [getPreamble(data, serialization)]
  for (let i = 0; i < inputs.length; ++i) {
    parts.push(serialization.beforeEachInput[i])
    parts.push(inputs[i])
  }
  parts.push(serialization.inBetween)
  return parts.join('')
}

/**
 * Extraction code for finding the text interleaved between sentinels in a prefix
 *
 * Inputs:
 *  text : a source text to extract results from
 *  sentinels: a list of sentinels S1,S2,...,SN
 *
 * Returns:
 *  the strings R1,R2,RN-1 if text is of the form S1 R1 S2 R2...RN-1 SN XX, null otherwise.
 *  on success the string index at the beginning of SN is also returned, for chaining.
 */
export const extractUsingSentinels = (
  data,
  serialization,
  text,
  sentinels,
  startPosition
) => {
  const results = []
  const num_sentinels = sentinels.length
  if (sentinels.length < 2) {
    console.log(
      'Extract using sentinels called with less than 2 sentinels',
      sentinels
    )
    return null
  }
  // Must start with first sentinel.
  if (
    sentinels[0].length > 0 &&
    text.indexOf(sentinels[0], startPosition) !== startPosition
  ) {
    console.log('Sentinel 0 not found', {
      text,
      sentinels,
      startPosition,
    })
    return null
  }
  let position = startPosition
  for (
    let sentinel_index = 0;
    sentinel_index < num_sentinels - 1;
    ++sentinel_index
  ) {
    position += sentinels[sentinel_index].length
    const nextSentinel = sentinels[sentinel_index + 1]
    const nextSentinelIndex = text.indexOf(nextSentinel, position)
    if (nextSentinelIndex === -1) {
      console.log('Sentinel not found', {
        text,
        sentinels,
        position,
        sentinel_index,
      })
      return null
    }
    results.push(text.substr(position, nextSentinelIndex - position))
    position = nextSentinelIndex
  }
  return { results, position }
}

export const extractOutput = (text, data, serialization) => {
  const xResult = extractUsingSentinels(
    data,
    serialization,
    text,
    serialization.beforeEachOutput.concat([serialization.atTheEnd]),
    0
  )
  return xResult ? xResult.results : null
}

export const extractDatum = (data, serialization, text) => {
  const inputResult = extractUsingSentinels(
    data,
    serialization,
    text,
    serialization.beforeEachInput.concat([serialization.inBetween]),
    0
  )
  if (inputResult) {
    const outputResult = extractUsingSentinels(
      data,
      serialization,
      text,
      [serialization.inBetween].concat(
        serialization.beforeEachOutput.concat([serialization.atTheEnd])
      ),
      inputResult.position
    )
    return outputResult
      ? { inputs: inputResult.results, outputs: outputResult.results.slice(1) }
      : null
  }
  return null
}

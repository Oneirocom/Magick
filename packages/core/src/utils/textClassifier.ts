/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import TopicDetection from 'topic-detection'

let detector: TopicDetection

export async function classifyText(input: any) {
  if (!detector || detector === undefined) {
    await initClassifier()
  }

  const scores = detector.topics(input)
  let higher = -1
  let _prop = ''

  for (let prop in scores) {
    if (Object.prototype.hasOwnProperty.call(scores, prop)) {
      if (scores[prop] > higher) {
        higher = scores[prop]
        _prop = prop
      }
    }
  }

  if (higher > 0 && _prop !== '') {
    return _prop.charAt(0).toUpperCase() + _prop.slice(1)
  } else {
    return ''
  }
}

export async function initClassifier() {
  if (detector) {
    return
  }

  detector = new TopicDetection()
}

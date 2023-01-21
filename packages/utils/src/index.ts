const punctRE =
  /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g
const spaceRE = /\s+/g
import nlp from 'compromise'
import {
  isBoolean,
  isDate,
  isEmpty,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from 'lodash'
import { match } from 'node-match-path'

export function removePunctuation(str: string): string {
  return str.replace(punctRE, '').replace(spaceRE, ' ')
}

export function simplifyWords(words: string[]): string[] {
  for (let i = 0; i < words.length; i++) {
    const doc = nlp(words[i])
    doc.nouns().toSingular().toLowerCase()
    doc.verbs().toPresentTense().toLowerCase()
    words[i] = doc.text()
  }

  return words
}

export function includeInFields(arr: string[], words: string[]): number {
  let count = 0
  for (let i = 0; i < words.length; i++) {
    let filtered = arr.filter(el => el.includes(words[i]))
    if (filtered.length) count++
  }
  return count
}

export function removeEmojisFromString(str: string): string {
  if (!str) return ''

  return str
    .replace(
      /(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g,
      ''
    )
    .replace(/:(.*?):/g, '')
}

export const isValidObject = (obj: any): boolean => {
  return obj && Object.keys(obj).length > 0
}

export const isValidArray = (arr: any): boolean => {
  return arr && Array.isArray(arr) && arr.length > 0
}

export const isValidObjectWithValues = (
  obj: any,
  skipKeys: string[]
): boolean => {
  let isValid = true

  if (isValidObject(obj)) {
    Object.entries(obj).forEach(([key, value]: any) => {
      if (!skipKeys.includes(key)) {
        if (
          (!isNumber(value) && !isBoolean(value) && isEmpty(value)) ||
          (!isNumber(value) && !isBoolean(value) && isUndefined(value))
        ) {
          isValid = false
        } else if (
          typeof value === 'string' &&
          isString(value) &&
          (value.length === 0 || value.charAt(0) === ' ')
        ) {
          isValid = false
        } else if (typeof value === 'object') {
          if (!(isValidArray(value) || isValidObject(value))) {
            isValid = false
          }
        } else if (typeof value === 'number' && !Number.isInteger(value)) {
          isValid = false
        }
      }
    })
    return isValid
  }
  return false
}

export const validBodyFieldsForUpdate = (obj: any, skipKeys: string[]): any => {
  let newObj: any = {}

  if (isValidObject(obj)) {
    const keys = Object.keys(obj)

    for (let index = 0; index < keys.length; index++) {
      let isValid = true
      const value = obj[keys[index]]
      if (!skipKeys.includes(keys[index])) {
        if (!isNumber(value) && !isBoolean(value) && isEmpty(value)) {
          isValid = false
        } else if (
          !isNumber(value) &&
          !isBoolean(value) &&
          isUndefined(value)
        ) {
          isValid = false
        } else if (
          isString(value) &&
          (value.length === 0 || value.charAt(0) === ' ')
        ) {
          isValid = false
        } else if (typeof value === 'object') {
          if (!(isValidArray(value) || isValidObject(value))) {
            isValid = false
          }
        } else if (isNumber(value) && value === 0) {
          isValid = false
        } else if (isNull(value)) {
          isValid = false
        }
      }

      if (isValid) {
        newObj[keys[index]] = value
      }
    }
  }
  return { ...newObj }
}

export const makeResponse = (message: string, body: any) => {
  if (isValidArray(body)) {
    return { message, payload: body }
  }

  if (isValidObject(body)) {
    return { message, payload: [body] }
  }

  return { message, payload: [] }
}

export const makeUpdateQuery = ({ table, wheres, cols }: any): string => {
  // Setup static beginning of query
  let query = [`UPDATE ${table}`]
  query.push('SET')

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  let set: any = []
  cols.forEach(function (col: any, i: number) {
    set.push(col + ' = ($' + (i + 1) + ')')
  })
  query.push(set.join(', '))

  query.push('WHERE')

  // Add the WHERE statement to look up by id
  Object.entries(wheres).forEach(([key, value]: any, index: number) => {
    if (index === 0) query.push(` ${key} = ` + value)
    if (index > 0) query.push(`AND ${key} = ` + value)
  })

  // Return a complete query string
  return query.join(' ')
}

export const isValidEndPoint = (urls: string[], endPoint: string): boolean => {
  let isValid: boolean = false

  for (let index = 0; index < urls.length; index++) {
    const url = urls[index]
    const { matches } = match(url, endPoint)

    if (matches) {
      isValid = matches
      break
    }
  }
  return isValid
}

export const stringIsAValidUrl = (s: string | any) => {
  try {
    new URL(s)
    return true
  } catch (err) {
    return false
  }
}

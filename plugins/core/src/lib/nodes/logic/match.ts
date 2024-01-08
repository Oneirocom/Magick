import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const regex = makeInNOutFunctionDesc({
  name: 'logic/string/match',
  aliases: ['logic/string/regex'],
  category: NodeCategory.Logic,
  label: 'Match',
  in: [{ match: 'string' }, { string: 'string' }],
  out: [{ result: 'boolean' }],
  exec: (regexInput, stringInput) => {
    try {
      // Create a RegExp object from the input string
      const regex = new RegExp(regexInput)

      // Test the string against the regex
      const match = regex.test(stringInput)

      // Return the result
      return match
    } catch (error) {
      // Handle and log errors if the regex is invalid or other issues arise
      console.error('Error executing regex:', error)
      // Return false or an appropriate error response
      return false
    }
  },
})

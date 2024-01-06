import { NodeCategory, makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const regex = makeInNOutFunctionDesc({
  name: 'logic/string/regex',
  category: NodeCategory.Logic,
  label: 'Regex',
  in: [
    {
      key: 'regex',
      valueType: 'string',
      descriptiosn: 'Regular expression to match.',
    },
    {
      key: 'string',
      valueType: 'string',
      description: 'String to test the regular expression against.',
    },
  ],
  out: [
    {
      key: 'match',
      valueType: 'boolean',
      description: 'Whether the string matches the regular expression.',
    },
  ],
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

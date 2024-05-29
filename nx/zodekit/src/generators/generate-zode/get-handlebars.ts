import type { HelperOptions } from 'handlebars'
import { create } from 'handlebars'

export const getHandlebars = () => {
  const instance = create()

  instance.registerHelper(
    'ifeq',
    function (a: string, b: string, options: HelperOptions) {
      if (a === b) {
        return options.fn(this)
      }

      return options.inverse(this)
    }
  )

  instance.registerHelper(
    'ifNotEmptyObj',
    function (obj: Record<string, any>, options: HelperOptions) {
      if (typeof obj === 'object' && Object.keys(obj).length > 0) {
        return options.fn(this)
      }

      return options.inverse(this)
    }
  )

  instance.registerHelper('toCamelCase', function (input: string) {
    if (/^[a-z][a-zA-Z0-9]*$/.test(input)) {
      return input
    }

    const words = input.split(/[\s_-]/)
    return words
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase()
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join('')
  })

  // New helper to check if an array is not empty
  instance.registerHelper('ifArrayNotEmpty', function (array, options) {
    if (Array.isArray(array) && array.length > 0) {
      return options.fn(this)
    }
    return options.inverse(this)
  })

  return instance
}

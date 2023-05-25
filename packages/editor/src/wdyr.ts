// DOCUMENTED
import { LOGGING_ENABLED } from '@magickml/core'
import whyDidYouRender from '@welldone-software/why-did-you-render'

/**
 * Enables the 'why-did-you-render' package in a React development environment
 *
 * @remarks
 * This function is called in a Node.js environment, and will enable 'why-did-you-render'
 * when the `NODE_ENV` variable is set to 'development'
 *
 * @param React - The React library instance
 */
function enableWhyDidYouRender(React: any): void {
  // If in development
  if (LOGGING_ENABLED) {
    console.log('running WDYR!')
    whyDidYouRender(React, {
      trackAllPureComponents: false,
    })
  }
}

export default enableWhyDidYouRender // Export the function for usage in other files.

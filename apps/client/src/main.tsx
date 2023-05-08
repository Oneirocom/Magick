// DOCUMENTED
import { createRoot } from 'react-dom/client'
import { MagickIDE, AppConfig } from '@magickml/editor'
import {
  DEFAULT_PROJECT_ID,
  API_ROOT_URL,
  TRUSTED_PARENT_URL,
  POSTHOG_API_KEY,
  POSTHOG_ENABLED,
  DEFAULT_USER_TOKEN,
  PRODUCTION,
} from '@magickml/core'
import { PostHogProvider } from 'posthog-js/react'

import plugins from './plugins'

console.log('plugins', plugins)
/**
 * Initialize and render the MagickIDE component when running as a standalone editor (not inside an iframe)
 */
if (window === window.parent) {
  if (!PRODUCTION) {
    const container = document.getElementById('root')
    const root = createRoot(container) // createRoot(container!) if you use TypeScript
    ;(window as any).root = root

    // Check URL parameters for projectId and apiUrl
    const projectId =
      new URLSearchParams(window.location.search).get('projectId') ??
      DEFAULT_PROJECT_ID

    const apiUrl =
      new URLSearchParams(window.location.search).get('apiUrl') ??
      API_ROOT_URL ??
      'http://localhost:3030'

    const config: AppConfig = {
      apiUrl,
      projectId,
      token: DEFAULT_USER_TOKEN,
    }

    const Root = () => <MagickIDE config={config} />

    root.render(<Root />)
  }
} else {
  /**
   * If the editor is loaded in an iframe, listen for messages from the parent to initialize and render the MagickIDE component
   */
  window.addEventListener(
    'message',
    event => {
      // Remove possible trailing slash on only the end
      const cloudUrl = TRUSTED_PARENT_URL?.replace(/\/+$/, '')

      // Check for trusted origin
      if (
        TRUSTED_PARENT_URL &&
        TRUSTED_PARENT_URL !== '' &&
        event.source !== window &&
        event.origin !== window.location.origin &&
        event.origin !== cloudUrl
      ) {
        console.error('untrusted origin', event.origin)
        console.error(
          'cloudUrl is ',
          cloudUrl,
          'TRUSTED_PARENT_URL',
          TRUSTED_PARENT_URL
        )
        return
      }

      const { data } = event
      const { type, payload } = data

      // Initialize and render the MagickIDE when message type is 'INIT'
      if (type === 'INIT') {
        // TODO: store configuration in localstorage
        const { config } = payload
        const Root = () => {
          if (POSTHOG_ENABLED === 'true') {
            return (
              <PostHogProvider
                apiKey={POSTHOG_API_KEY}
                options={{
                  api_host: 'https://app.posthog.com',
                }}
              >
                <MagickIDE config={config} />
              </PostHogProvider>
            )
          } else {
            return <MagickIDE config={config} />
          }
        }
        const container = document.getElementById('root')
        const root = createRoot(container) // createRoot(container!) if you use TypeScript
        ;(window as any).root = root
        root.render(<Root />)
      }
    },
    false
  )
}

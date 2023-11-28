// DOCUMENTED
import { createRoot } from 'react-dom/client'
import { MagickIDE } from 'client/editor'
import {
  DEFAULT_PROJECT_ID,
  API_ROOT_URL,
  TRUSTED_PARENT_URL,
  POSTHOG_API_KEY,
  POSTHOG_ENABLED,
  DEFAULT_USER_TOKEN,
  STANDALONE,
} from 'shared/config'
import { PostHogProvider } from 'posthog-js/react'
import { initLogger, getLogger } from 'server/logger'

import plugins from './plugins'
import { AppConfig } from '@magickml/providers'

// We want to add this back in eventually, but it's causing some visual bugs
//import './globals.css'
console.info('loaded with plugins %o', plugins)
/**
 * Initialize and render the MagickIDE component when running as a standalone editor (not inside an iframe)
 */
if (window === window.parent) {
  if (STANDALONE) {
    console.info('standalone')
    const container = document.getElementById('root') as Element
    const root = createRoot(container) // createRoot(container!) if you use TypeScript
      ; (window as any).root = root

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
  const TRUSTED_PARENT_URLS = [
    TRUSTED_PARENT_URL,
    'https://www.magickml.com',
    'https://beta.magickml.com']
    .map(url => url.replace(/\/+$/, ''));

  window.addEventListener(
    'message',
    event => {
      // Check for trusted origin
      if (
        TRUSTED_PARENT_URLS.length > 0 &&
        event.source !== window &&
        event.origin !== window.location.origin &&
        !TRUSTED_PARENT_URLS.includes(event.origin)
      ) {
        console.error('Untrusted origin %s', event.origin);
        // Log the trusted origins for debugging purposes
        TRUSTED_PARENT_URLS.forEach(trustedUrl => {
          console.error('Trusted origin is %s', trustedUrl);
        });

        return;
      }

      const { data } = event
      const { type, payload } = data

      // Initialize and render the MagickIDE when message type is 'INIT'
      if (type === 'INIT') {
        // TODO: store configuration in localstorage
        const { config } = payload as { config: AppConfig }
        const Root = () => {
          if (POSTHOG_ENABLED && config?.posthogEnabled) {
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
        const container = document.getElementById('root') as Element
        const root = createRoot(container) // createRoot(container!) if you use TypeScript
          ; (window as any).root = root

        root.render(<Root />)
      }
    },
    false
  )
}

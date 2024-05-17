// DOCUMENTED
import { createRoot } from 'react-dom/client'
import { MagickIDE } from 'client/editor'
import {
  API_ROOT_URL,
  TRUSTED_PARENT_URL,
  POSTHOG_API_KEY,
  POSTHOG_ENABLED,
  STANDALONE,
} from 'shared/config'
import { PostHogProvider } from 'posthog-js/react'

import { AppConfig } from '@magickml/providers'

import 'dockview/dist/styles/dockview.css'
import '@xyflow/react/dist/style.css'
import '../../../packages/client/stylesheets/src/lib/styles/behaveFlow.css'
import '../../../packages/client/stylesheets/src/lib/design-globals/design-globals.css'
import '../../../packages/client/stylesheets/src/lib/App.css'
import '../../../packages/client/stylesheets/src/lib/styles/dockview.css'
import '../../../packages/client/stylesheets/src/lib/styles/themes.scss'
import { DEFAULT_PROJECT_ID, DEFAULT_USER_TOKEN } from 'clientConfig'
import { useState } from 'react'

/**
 * Initialize and render the MagickIDE component when running as a standalone editor (not inside an iframe)
 */
if (window === window.parent) {
  if (STANDALONE) {
    console.info('standalone')
    const container = document.getElementById('root') as Element
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
      userId: '',
      email: undefined,
      providerData: {},
    }

    const Root = () => {
      const loading = useState(true)
      const loadingStatus = useState()
      return (
        <MagickIDE
          config={config}
          loading={loading}
          loadingStatus={loadingStatus}
        />
      )
    }

    root.render(<Root />)
  }
} else {
  /**
   * If the editor is loaded in an iframe, listen for messages from the parent to initialize and render the MagickIDE component
   */
  const TRUSTED_PARENT_URLS = [
    TRUSTED_PARENT_URL,
    'https://www.magickml.com',
    'https://beta.magickml.com',
  ].map(url => url.replace(/\/+$/, ''))

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
        console.error('Untrusted origin %s', event.origin)
        // Log the trusted origins for debugging purposes
        TRUSTED_PARENT_URLS.forEach(trustedUrl => {
          console.error('Trusted origin is %s', trustedUrl)
        })

        return
      }

      const { data } = event
      const { type, payload } = data

      // Initialize and render the MagickIDE when message type is 'INIT'
      if (type === 'INIT') {
        // TODO: store configuration in localstorage
        const { config } = payload as { config: AppConfig }

        const Root = () => {
          const loading = useState(true)
          const loadingStatus = useState()

          if (POSTHOG_ENABLED && config?.posthogEnabled) {
            return (
              <PostHogProvider
                apiKey={POSTHOG_API_KEY}
                options={{
                  api_host: 'https://app.posthog.com',
                  loaded: posthog_instance => {
                    posthog_instance.identify(config.email)
                  },
                }}
              >
                <MagickIDE
                  config={config}
                  loading={loading}
                  loadingStatus={loadingStatus}
                />
              </PostHogProvider>
            )
          } else {
            return (
              <MagickIDE
                config={config}
                loading={loading}
                loadingStatus={loadingStatus}
              />
            )
          }
        }
        const container = document.getElementById('root') as Element
        const root = createRoot(container) // createRoot(container!) if you use TypeScript
        ;(window as any).root = root

        const userId = config.userId
        document.cookie = `magick-userId=${userId};path=/;max-age=31536000;SameSite=Strict;Secure`

        root.render(<Root />)
      }
    },
    false
  )
}

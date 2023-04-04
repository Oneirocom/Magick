// DOCUMENTED 
import { createRoot } from 'react-dom/client'
import { MagickIDE, AppConfig } from '@magickml/editor'
import { DEFAULT_PROJECT_ID, API_ROOT_URL, TRUSTED_PARENT_URL, UNTRUSTED_IFRAME } from '@magickml/core'

import plugins from './plugins'

console.log('plugins', plugins)
/**
 * Initialize and render the MagickIDE component when running as a standalone editor (not inside an iframe)
 */
if (window === window.parent) {
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
    token: '',
  }

  const Root = () => <MagickIDE config={config} />
  root.render(<Root />)
}

/**
 * If the editor is loaded in an iframe, listen for messages from the parent to initialize and render the MagickIDE component
 */
else {
  window.addEventListener(
    'message',
    event => {
      // Remove possible trailing slash on only the end
      const cloudUrl = TRUSTED_PARENT_URL.replace(/\/+$/, '')

      // Check for trusted origin
      if (
        !UNTRUSTED_IFRAME &&
        event.source !== window &&
        event.origin !== window.location.origin &&
        event.origin !== cloudUrl
      ) {
        console.warn('untrusted origin', event.origin)
        console.warn('EXITING')
        return
      }

      const { data } = event
      const { type, payload } = data

      // Initialize and render the MagickIDE when message type is 'INIT'
      if (type === 'INIT') {
        // TODO: store configuration in localstorage
        const { config } = payload

        const Root = () => <MagickIDE config={config} />
        const container = document.getElementById('root')
        const root = createRoot(container) // createRoot(container!) if you use TypeScript
        ;(window as any).root = root
        root.render(<Root />)
      }
    },
    false
  )
}
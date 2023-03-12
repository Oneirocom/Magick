import { createRoot } from 'react-dom/client'
import { MagickIDE, AppConfig } from '@magickml/editor'
import { DEFAULT_PROJECT_ID, API_ROOT_URL } from '@magickml/engine'

import './plugins'

// check urlParams for projectId and apiUrl
const projectId =
  new URLSearchParams(window.location.search).get('projectId') ?? DEFAULT_PROJECT_ID
const apiUrl =
  new URLSearchParams(window.location.search).get('apiUrl') ??
  API_ROOT_URL ??
  'http://localhost:3030'

// we need some way to turn this on when we need it.

if (window !== window.parent) {
  window.addEventListener(
    'message',
    event => {
      const cloudUrl =
        import.meta.env.VITE_APP_TRUSTED_PARENT_URL || 'http://localhost:3000'
      // here we check that the sender is coming from a trusted source
      if (event.origin !== cloudUrl) return

      const { data } = event
      const { type, payload } = data

      // not sure when we would use different types, but good to be sure.
      if (type === 'INIT') {
        // to do - we shold store this stuiff in localstorage
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
} else {
  const container = document.getElementById('root')
  const root = createRoot(container) // createRoot(container!) if you use TypeScript
  ;(window as any).root = root
  const config: AppConfig = {
    apiUrl,
    projectId,
    token: '',
  }
  const Root = () => <MagickIDE config={config} />

  root.render(<Root />)
}

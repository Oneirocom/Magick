import React from 'react'
import { createRoot } from 'react-dom/client'
import MagickIDE, { MagickIDEProps } from "@magickml/editor";

// load plugins
await (async () => {
  let plugins = (await import('./plugins')).default
  console.log('loaded plugins on server', plugins)
})()

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
;(window as any).root = root
const config: MagickIDEProps = {
    apiUrl: import.meta.env.VITE_APP_API_URL,
}
const Root = () => (
  <MagickIDE config={config} />
)

root.render(<Root />)
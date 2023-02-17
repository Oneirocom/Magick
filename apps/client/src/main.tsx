import React from 'react'
import { createRoot } from 'react-dom/client'
import MagickIDE from "@magickml/editor";

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
;(window as any).root = root
const Root = () => (
  <MagickIDE />
)

root.render(<Root />)
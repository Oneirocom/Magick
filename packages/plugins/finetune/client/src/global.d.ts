// We need to tell TypeScript that when we write "import styles from './styles.scss' we mean to load a module (to look for a './styles.scss.d.ts').
declare module '*.css'
declare module '*.module.css'
declare module '*.jpg'
declare module '*.png'
declare module '*.md' {
  // When "Mode.React" is requested. VFC could take a generic like React.VFC<{ MyComponent: TypeOfMyComponent }>
  import React from 'react'
  const ReactComponent: React.VFC
  export { ReactComponent }
}

declare global {
  interface Window {
    getLayout: any
  }
}
export {}

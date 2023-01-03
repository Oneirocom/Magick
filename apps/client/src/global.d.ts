// We need to tell TypeScript that when we write "import styles from './styles.scss' we mean to load a module (to look for a './styles.scss.d.ts').
declare module '*.css'
declare module '*.module.css'
declare module '*.jpg'
declare module '*.png'

declare global {
  interface Window {
    getLayout: any
  }
}
export {}

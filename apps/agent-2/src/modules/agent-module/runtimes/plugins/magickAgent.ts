import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
// @ts-ignore
import magickPlugins from '#magick/plugins'

export default defineNitroPlugin(nitroApp => {
  console.log('magick plugins', magickPlugins)
})

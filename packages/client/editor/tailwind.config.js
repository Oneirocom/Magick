const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'node_modules/flowbite-react/lib/esm/**/*.js',
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [require('flowbite/plugin')],
  theme: {
    extend: {
      fontFamily: {
        berkeleyMono: [
          'Montserrat Variable',
          'IBM Plex Sans',
          'IBM Plex Mono',
          'sans-serif',
        ],
        montserrat: ['Montserrat'],
        montserratAlt: ['var(--font-montserrat-alternates)'],
      },
    },
  },
}

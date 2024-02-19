import type { SVGProps } from 'react'
const SvgPlayPrint = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 31 31"
    {...props}
  >
    <path
      d="M0 0h30v30H0z"
      style={{
        fill: 'none',
      }}
      transform="translate(.34 .63)"
    />
    <path
      d="m190.483 60.296-5.617-4.998v9.997zm7.067.007-4.27 3.8h10.535v-3.8zm-8.494-7.572 4.27 3.8h10.489v-3.8zm-4.19-3.769h18.949v-3.8h-18.949z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-179 -39)"
    />
  </svg>
)
export default SvgPlayPrint

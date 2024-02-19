import type { SVGProps } from 'react'
const SvgText = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 31 30"
    {...props}
  >
    <path
      d="M0 0h30v30H0z"
      style={{
        fill: 'none',
      }}
      transform="translate(.361)"
    />
    <path
      d="M148.887 24.608h3.789v-3.8h-3.789zm7.474 0h11.474v-3.8h-11.474zm7.685-7.638h3.789v-3.8h-3.789zm-15.159 0h11.474v-3.8h-11.474zm0-7.639h6.451v-3.8h-6.451zm10.241 0h8.707v-3.8h-8.707z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-143)"
    />
  </svg>
)
export default SvgText

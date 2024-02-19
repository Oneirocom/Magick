import type { SVGProps } from 'react'
const SvgAdd = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.389)"
    />
    <path
      d="M505.489 12.825h-7.575v3.8h7.575v7.852h3.8v-7.852h7.574v-3.8h-7.574V5.526h-3.8z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-492)"
    />
  </svg>
)
export default SvgAdd

import type { SVGProps } from 'react'
const SvgProperties = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.059)"
    />
    <path
      d="M287.585 24.514h3.79v-3.8h-3.79zm7.368 0h11.581v-3.8h-11.581zm-7.368-7.623h3.79v-3.8h-3.79zm7.368 0h11.581v-3.8h-11.581zm0-7.623h11.581v-3.8h-11.581zm-7.368 0h3.79v-3.8h-3.79z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-282)"
    />
  </svg>
)
export default SvgProperties

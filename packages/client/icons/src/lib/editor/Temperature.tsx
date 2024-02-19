import type { SVGProps } from 'react'
const SvgTemperature = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.709)"
    />
    <path
      d="M468.809 216.938a5.705 5.705 0 0 0-3.8 5.375c0 3.146 2.554 5.7 5.7 5.7s5.7-2.554 5.7-5.7a5.705 5.705 0 0 0-3.8-5.375v-8.599a1.901 1.901 0 0 0-3.8 0zm1.9 3.475a1.901 1.901 0 0 1 0 3.8 1.9 1.9 0 0 1 0-3.8"
      style={{
        fill: '#fff',
      }}
      transform="translate(-455 -202.031)"
    />
  </svg>
)
export default SvgTemperature

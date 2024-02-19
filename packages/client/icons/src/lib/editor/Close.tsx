import type { SVGProps } from 'react'
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      d="M0 0h30v30H0z"
      style={{
        fill: 'none',
      }}
    />
    <path
      d="M505.489 12.825h-9.46v3.8h9.46v9.738h3.8v-9.738h9.46v-3.8h-9.46v-9.46h-3.8z"
      style={{
        fill: '#fff',
      }}
      transform="rotate(45 261.03 -579.434)"
    />
  </svg>
)
export default SvgClose

import type { SVGProps } from 'react'
const SvgTime = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.637)"
    />
    <path
      d="M330.638 3.627c-6.278 0-11.375 5.097-11.375 11.375s5.097 11.375 11.375 11.375 11.375-5.097 11.375-11.375-5.097-11.375-11.375-11.375m0 3.8a7.58 7.58 0 0 1 7.575 7.575 7.58 7.58 0 0 1-7.575 7.575 7.58 7.58 0 0 1-7.575-7.575 7.58 7.58 0 0 1 7.575-7.575m-1.25 1.949v6.411l5.5 2.649 1.085-2.252-4.085-1.968v-4.84z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-315)"
    />
  </svg>
)
export default SvgTime

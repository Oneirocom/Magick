import type { SVGProps } from 'react'
const SvgMerge = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.299)"
    />
    <path
      d="M112.825 24.608h18.949v-3.8h-18.949zm18.949-19.077h-14.026a5.72 5.72 0 0 0-5.718 5.718v.003a5.72 5.72 0 0 0 5.718 5.718h14.026v-3.8h-14.026a1.92 1.92 0 0 1-1.918-1.918v-.003a1.92 1.92 0 0 1 1.918-1.918h14.026z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-107)"
    />
  </svg>
)
export default SvgMerge

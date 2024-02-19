import type { SVGProps } from 'react'
const SvgPause = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.197)"
    />
    <path
      d="M588.782 24.474V5.526h-3.8v18.948zm-11.369 0V5.526h-3.8v18.948z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-566)"
    />
  </svg>
)
export default SvgPause

import type { SVGProps } from 'react'
const SvgState = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.143)"
    />
    <path
      d="M228.143 26.374c6.278 0 11.375-5.096 11.375-11.374 0-3.151-1.284-6.005-3.357-8.066l-2.679 2.695A7.56 7.56 0 0 1 235.718 15a7.58 7.58 0 0 1-7.575 7.574zm0-22.748c-6.278 0-11.374 5.096-11.374 11.374 0 3.127 1.264 5.96 3.309 8.017l2.695-2.679A7.55 7.55 0 0 1 220.569 15a7.58 7.58 0 0 1 7.574-7.574z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-213)"
    />
  </svg>
)
export default SvgState

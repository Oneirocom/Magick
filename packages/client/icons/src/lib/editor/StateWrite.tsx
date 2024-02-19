import type { SVGProps } from 'react'
const SvgStateWrite = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.389 .63)"
    />
    <path
      d="M507.389 268.037c6.277 0 11.374-5.097 11.374-11.375 0-3.151-1.284-6.005-3.357-8.066l-2.679 2.695a7.55 7.55 0 0 1 2.236 5.371 7.58 7.58 0 0 1-7.574 7.575zm0-22.749c-6.278 0-11.375 5.096-11.375 11.374 0 3.127 1.264 5.961 3.309 8.018l2.695-2.679a7.56 7.56 0 0 1-2.204-5.339 7.58 7.58 0 0 1 7.575-7.574zm5.451 10.381c-1.364-1.813-3.355-2.856-5.451-2.856s-4.087 1.043-5.451 2.856l-.748.993.748.993c1.364 1.813 3.355 2.856 5.451 2.856s4.087-1.043 5.451-2.856l.747-.993zm-2.56.993a3.807 3.807 0 0 0-5.783 0 3.81 3.81 0 0 0 5.783 0"
      style={{
        fill: '#fff',
      }}
      transform="translate(-492 -241.031)"
    />
  </svg>
)
export default SvgStateWrite

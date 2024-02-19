import type { SVGProps } from 'react'
const SvgStateRead = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.694 .63)"
    />
    <path
      d="M470.694 66.005c6.278 0 11.375-5.096 11.375-11.374 0-3.151-1.284-6.005-3.357-8.066l-2.679 2.695a7.55 7.55 0 0 1 2.236 5.371 7.58 7.58 0 0 1-7.575 7.574zm0-22.749c-6.277 0-11.374 5.097-11.374 11.375 0 3.127 1.264 5.96 3.309 8.017l2.695-2.679a7.55 7.55 0 0 1-2.204-5.338 7.58 7.58 0 0 1 7.574-7.575zm-4.657 16.079h9.315v-2.5h-9.315zm0-3.452h9.315v-2.5h-9.315zm0-3.456h9.315v-2.5h-9.315z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-455 -39)"
    />
  </svg>
)
export default SvgStateRead

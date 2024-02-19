import type { SVGProps } from 'react'
const SvgInfo = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.846)"
    />
    <path
      d="M619.846 4.5c5.795 0 10.5 4.705 10.5 10.5s-4.705 10.5-10.5 10.5-10.5-4.705-10.5-10.5 4.705-10.5 10.5-10.5m0 3.8c3.697 0 6.7 3.002 6.7 6.7s-3.003 6.7-6.7 6.7a6.703 6.703 0 0 1-6.7-6.7c0-3.698 3.002-6.7 6.7-6.7m-1.25 5.755v5.685h2.5v-5.685zm0-3.792v2.462h2.5v-2.462z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-604)"
    />
  </svg>
)
export default SvgInfo

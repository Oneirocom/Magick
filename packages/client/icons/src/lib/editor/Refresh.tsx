import type { SVGProps } from 'react'
const SvgRefresh = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.685)"
    />
    <path
      d="M199.412 10.042a7.58 7.58 0 0 1 1.002 8.438 7.577 7.577 0 0 1-10.207 3.25 7.58 7.58 0 0 1-3.25-10.207 7.58 7.58 0 0 1 6.88-4.095l.071-3.799c-4.193-.078-8.272 2.175-10.326 6.149-2.883 5.577-.696 12.445 4.88 15.328 5.577 2.883 12.445.696 15.328-4.881 2.226-4.305 1.429-9.381-1.616-12.798l2.919.001.001-3.8-9.468-.003-.021 9.359 3.8.009z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-178)"
    />
  </svg>
)
export default SvgRefresh

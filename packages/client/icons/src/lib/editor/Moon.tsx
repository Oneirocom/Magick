import type { SVGProps } from 'react'
const SvgMoon = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.532 .63)"
    />
    <path
      d="M407.808 52.035c0 4.567-3.708 8.275-8.276 8.275a8.28 8.28 0 0 1-8.275-8.275h-3.8c0 6.665 5.411 12.075 12.075 12.075 6.665 0 12.076-5.41 12.076-12.075zm-8.276-6.879a6.88 6.88 0 0 1 6.879 6.879 6.88 6.88 0 0 1-6.879 6.879 6.88 6.88 0 0 1-6.878-6.879 6.88 6.88 0 0 1 6.878-6.879m0 3.8a3.08 3.08 0 1 1-3.078 3.079 3.08 3.08 0 0 1 3.078-3.079"
      style={{
        fill: '#fff',
      }}
      transform="translate(-384 -39)"
    />
  </svg>
)
export default SvgMoon

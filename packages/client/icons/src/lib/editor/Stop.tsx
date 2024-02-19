import type { SVGProps } from 'react'
const SvgStop = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.348)"
    />
    <path
      d="M444.822 5.527h-18.949v18.95h18.949zm-3.8 3.8v11.35h-11.349V9.327z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-420)"
    />
  </svg>
)
export default SvgStop

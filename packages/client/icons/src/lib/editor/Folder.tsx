import type { SVGProps } from 'react'
const SvgFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      d="M0 0h30v30H0z"
      style={{
        fill: 'none',
      }}
    />
    <path
      d="M663.785 24.474V9.315h-5.81V5.551l-13.139-.025v18.948zm-9.61-15.131v3.772h5.81v7.559h-11.349V9.333z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-639.311)"
    />
  </svg>
)
export default SvgFolder

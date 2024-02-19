import type { SVGProps } from 'react'
const SvgTiles = (props: SVGProps<SVGSVGElement>) => (
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
      d="M685.412 17.163h-7.311v7.311h7.311zm11.638 0h-7.312v7.311h7.312zm0-11.637h-7.312v7.311h7.312zm-11.638 0h-7.311v7.311h7.311z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-672.575)"
    />
  </svg>
)
export default SvgTiles

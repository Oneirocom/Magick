import type { SVGProps } from 'react'
const SvgPlay = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.601)"
    />
    <path
      d="M273.816 15 253.127 4.018v21.964zm-8.105 0-8.784 4.663v-9.326z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-247)"
    />
  </svg>
)
export default SvgPlay

import type { SVGProps } from 'react'
const SvgWarn = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.58)"
    />
    <path
      d="m50.324 0-15 30h30zm0 11.752 6.369 12.738H43.956z"
      style={{
        fill: '#fff',
      }}
      transform="matrix(.73212 0 0 .68965 -21.264 3.785)"
    />
  </svg>
)
export default SvgWarn

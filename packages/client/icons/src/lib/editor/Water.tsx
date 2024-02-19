import type { SVGProps } from 'react'
const SvgWater = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 30 31"
    {...props}
  >
    <path
      d="M0 0h30v30H0z"
      style={{
        fill: 'none',
      }}
      transform="translate(0 .63)"
    />
    <path
      d="m2.549 64.964 4.114-3.854 3.973 3.721 4.195-3.929 4.274 4.004 4.113-3.853 4.091 3.832 2.549-2.789-6.64-6.22-4.113 3.853-4.274-4.004-4.195 3.929-3.972-3.721L0 62.175zm.142-11.369 4.114-3.854 3.973 3.721 4.194-3.929 4.275 4.004 4.113-3.853 4.091 3.832L30 50.727l-6.64-6.22-4.113 3.853-4.275-4.004-4.194 3.929-3.973-3.721-6.663 6.242z"
      style={{
        fill: '#fff',
      }}
      transform="translate(0 -39)"
    />
  </svg>
)
export default SvgWater

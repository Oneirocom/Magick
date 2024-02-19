import type { SVGProps } from 'react'
const SvgBird = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.804 .63)"
    />
    <path
      d="m325.119 45.156-5.501 3.79h5.501v5.436a5.93 5.93 0 0 0 4.435 5.741v1.492h-4.435v2.5h11.369v-2.5h-4.434v-1.3h12.014l-13.724-16.747a2.95 2.95 0 0 0-3.27-.907c-1.104.394-1.87 1.34-1.955 2.495m3.8 2.668 7.122 8.691h-4.988a2.134 2.134 0 0 1-2.134-2.133z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-315 -39)"
    />
  </svg>
)
export default SvgBird

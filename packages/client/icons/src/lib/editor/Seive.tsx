import type { SVGProps } from 'react'
const SvgSeive = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.369 .63)"
    />
    <path
      d="M229.37 43.258c-6.278 0-11.375 5.097-11.375 11.375s5.097 11.375 11.375 11.375 11.375-5.097 11.375-11.375-5.097-11.375-11.375-11.375m4.676 17.333a7.54 7.54 0 0 1-4.676 1.617 7.54 7.54 0 0 1-4.676-1.617zm2.797-4.71a7.5 7.5 0 0 1-.733 2.21h-13.48a7.5 7.5 0 0 1-.732-2.21zm-.735-4.71c.352.683.603 1.426.734 2.21h-14.944a7.5 7.5 0 0 1 .734-2.21zm-2.067-2.5h-9.342a7.54 7.54 0 0 1 4.671-1.613c1.762 0 3.384.602 4.671 1.613"
      style={{
        fill: '#fff',
      }}
      transform="translate(-214 -39)"
    />
  </svg>
)
export default SvgSeive

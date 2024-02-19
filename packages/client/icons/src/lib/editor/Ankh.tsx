import type { SVGProps } from 'react'
const SvgAnkh = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.159 .633)"
    />
    <path
      d="M541.255 52.733h-6.57v3.8h7.574v9.091h3.8v-9.091h7.575v-3.8h-6.571c.309-.462.679-.993 1.049-1.469a6.294 6.294 0 0 0 0-7.796l-.001-.001c-1.082-1.39-2.534-2.018-3.952-2.018-1.417 0-2.87.628-3.951 2.018l-.002.001a6.294 6.294 0 0 0 0 7.796c.37.476.741 1.007 1.049 1.469m4.883-7.731c-1.093-1.404-2.865-1.404-3.958 0l-.001.002a3.81 3.81 0 0 0 0 4.724c.99 1.272 1.98 2.905 1.98 2.905s.99-1.633 1.98-2.905a3.81 3.81 0 0 0 0-4.724z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-529 -39)"
    />
  </svg>
)
export default SvgAnkh

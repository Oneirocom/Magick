import type { SVGProps } from 'react'
const SvgSwitch = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.325 .046)"
    />
    <path
      d="M51.165 50.262h1.786a3.8 3.8 0 0 1 3.8 3.8v.001a3.8 3.8 0 0 1-3.8 3.8h-1.794a5.705 5.705 0 0 0-5.375-3.8 5.703 5.703 0 0 0-5.7 5.7c0 3.146 2.554 5.7 5.7 5.7a5.705 5.705 0 0 0 5.375-3.8h1.794a7.6 7.6 0 0 0 7.6-7.6v-.001a7.6 7.6 0 0 0-7.6-7.6h-1.786a5.705 5.705 0 0 0-5.375-3.8 5.703 5.703 0 0 0-5.7 5.7c0 3.146 2.554 5.7 5.7 5.7a5.71 5.71 0 0 0 5.375-3.8m-5.383 11.401a1.901 1.901 0 1 1 1.9-1.9c0 1.048-.851 1.9-1.9 1.9m.008-15.201a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8"
      style={{
        fill: '#fff',
      }}
      transform="translate(-35 -39)"
    />
  </svg>
)
export default SvgSwitch

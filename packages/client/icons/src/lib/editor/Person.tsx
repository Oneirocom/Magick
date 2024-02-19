import type { SVGProps } from 'react'
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
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
      d="M614.112 63.472a5.73 5.73 0 0 1 5.726-5.727 5.73 5.73 0 0 1 5.726 5.727h3.8c0-5.258-4.268-9.527-9.526-9.527s-9.526 4.269-9.526 9.527zm5.726-19.817a4.66 4.66 0 0 1 4.658 4.658 4.66 4.66 0 0 1-4.658 4.657 4.66 4.66 0 0 1-4.658-4.657 4.66 4.66 0 0 1 4.658-4.658m0 3.8a.858.858 0 1 1 0 1.717.858.858 0 0 1 0-1.717"
      style={{
        fill: '#fff',
      }}
      transform="translate(-604.846 -38.997)"
    />
  </svg>
)
export default SvgPerson

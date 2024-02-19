import type { SVGProps } from 'react'
const SvgStopSign = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.986)"
    />
    <path
      d="m408.029 6.957-8.043-3.331-8.042 3.331L388.612 15l3.332 8.043 8.042 3.331 8.043-3.331L411.361 15zm-8.043.469 5.356 2.218L407.561 15l-2.219 5.356-5.356 2.218-5.355-2.218L392.412 15l2.219-5.356z"
      style={{
        fill: '#fff',
      }}
      transform="matrix(1 -.41421 .41421 1 -390.214 165.68)"
    />
  </svg>
)
export default SvgStopSign

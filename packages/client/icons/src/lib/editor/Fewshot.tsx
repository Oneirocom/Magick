import type { SVGProps } from 'react'
const SvgFewshot = (props: SVGProps<SVGSVGElement>) => (
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
      d="M371.684 20.638h-15.159v3.8l15.159-.011 3.79-1.937zm3.79-5.727-3.79-1.853h-15.159v3.8l15.159-.01zm-3.79-9.432h-15.159v3.8h15.159l3.79-1.948z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-351)"
    />
  </svg>
)
export default SvgFewshot

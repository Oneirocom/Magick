import type { SVGProps } from 'react'
const SvgMinus = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.388)"
    />
    <path
      d="M95.471 30v-9.315H91.59V30z"
      style={{
        fill: '#fff',
      }}
      transform="matrix(0 .97908 -2.03414 0 66.938 -76.848)"
    />
  </svg>
)
export default SvgMinus

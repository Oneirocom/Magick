import type { SVGProps } from 'react'
const SvgCloth = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.615 .63)"
    />
    <path
      d="M368.468 56.918v-7.33c0-.429.388-.777.866-.777h.001c.23 0 .45.082.612.227a.74.74 0 0 1 .254.55v14.517h3.8V49.588c0-1.11-.492-2.175-1.367-2.96s-2.062-1.226-3.299-1.226h-.001c-2.577 0-4.666 1.874-4.666 4.186v7.33z"
      style={{
        fill: '#fff',
      }}
      transform="matrix(1 0 0 1.11479 -353.719 -46.359)"
    />
  </svg>
)
export default SvgCloth

import type { SVGProps } from 'react'
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.255)"
    />
    <path
      d="M10.093 17.475a8.6 8.6 0 0 1-1.338-4.62c0-4.771 3.874-8.644 8.645-8.644s8.644 3.873 8.644 8.644S22.171 21.5 17.4 21.5a8.6 8.6 0 0 1-4.62-1.338l-5.656 5.656-2.687-2.687zM17.4 8.011a4.846 4.846 0 0 1 0 9.689 4.847 4.847 0 0 1-4.845-4.845A4.846 4.846 0 0 1 17.4 8.011"
      style={{
        fill: '#fff',
      }}
    />
  </svg>
)
export default SvgSearch

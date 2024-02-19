import type { SVGProps } from 'react'
const SvgAccount = (props: SVGProps<SVGSVGElement>) => (
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
      d="M581.752 42.624c-6.278 0-11.375 5.097-11.375 11.375s5.097 11.375 11.375 11.375 11.375-5.097 11.375-11.375-5.097-11.375-11.375-11.375m3.429 18.13a3.706 3.706 0 0 0-6.872-.007 7.54 7.54 0 0 0 3.443.827 7.54 7.54 0 0 0 3.429-.82m2.045-1.521a7.55 7.55 0 0 0 2.101-5.234 7.58 7.58 0 0 0-7.575-7.575 7.58 7.58 0 0 0-7.575 7.575c0 2.024.795 3.863 2.09 5.222a6.205 6.205 0 0 1 10.959.012m-5.483-11.439a3.73 3.73 0 0 0-3.726 3.726 3.73 3.73 0 0 0 3.726 3.727 3.73 3.73 0 0 0 3.727-3.727 3.73 3.73 0 0 0-3.727-3.726m0 2.5a1.226 1.226 0 1 1 .001 2.453 1.226 1.226 0 0 1-.001-2.453"
      style={{
        fill: '#fff',
      }}
      transform="translate(-566.751 -38.997)"
    />
  </svg>
)
export default SvgAccount

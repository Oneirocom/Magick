import type { SVGProps } from 'react'
const SvgFeathers = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.417 .63)"
    />
    <path
      d="M441.569 262.245v3.892h2.5l.009-15.16c0-1.605-.368-5.449-4.754-5.691l-1.564-.004-3.531 14.978zm-10.993 0v3.892h2.5l.009-15.16c0-1.605-.368-5.449-4.754-5.691l-1.564-.004-3.531 14.978zm8.173-4.68 1.539.417.009-6.985zm-10.993 0 1.54.417.008-6.985z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-419 -241.031)"
    />
  </svg>
)
export default SvgFeathers

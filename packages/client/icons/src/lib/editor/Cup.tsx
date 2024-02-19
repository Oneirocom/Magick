import type { SVGProps } from 'react'
const SvgCup = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.005 .63)"
    />
    <path
      d="m100.927 50.746-2.691-2.691a9.53 9.53 0 0 0-6.739-2.791H76.475V55.81a9.487 9.487 0 0 0 9.484 9.484h.002a9.483 9.483 0 0 0 9.484-9.484v-5.172l2.795 2.795zm-9.282-1.682h-11.37v6.746a5.684 5.684 0 0 0 5.684 5.684h.002a5.684 5.684 0 0 0 5.684-5.684z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-71 -39)"
    />
  </svg>
)
export default SvgCup

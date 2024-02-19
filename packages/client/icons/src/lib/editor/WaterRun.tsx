import type { SVGProps } from 'react'
const SvgWaterRun = (props: SVGProps<SVGSVGElement>) => (
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
    <g transform="translate(.728 .63)">
      <path
        d="M0 0h30v30H0z"
        style={{
          fill: 'none',
        }}
      />
      <clipPath id="water-run_svg__a">
        <path d="M0 0h30v30H0z" />
      </clipPath>
      <g clipPath="url(#water-run_svg__a)">
        <path
          d="m110.05 64.964 4.166-3.854 4.022 3.721 6.931-6.413-2.58-2.79-4.351 4.026-4.022-3.721-6.746 6.242zm18.362-.847h6.745v-3.8h-6.745zm-18.218-10.522 4.165-3.854 4.022 3.721 4.247-3.929 4.328 4.004 4.164-3.853 4.141 3.832 2.581-2.789-6.722-6.22-4.164 3.853-4.328-4.004-4.247 3.929-4.022-3.721-6.746 6.242z"
          style={{
            fill: '#fff',
          }}
          transform="translate(-107.728 -39.63)"
        />
      </g>
    </g>
  </svg>
)
export default SvgWaterRun

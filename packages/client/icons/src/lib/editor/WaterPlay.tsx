import type { SVGProps } from 'react'
const SvgWaterPlay = (props: SVGProps<SVGSVGElement>) => (
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
    <g transform="translate(.656 .63)">
      <path
        d="M0 0h30v30H0z"
        style={{
          fill: 'none',
        }}
      />
      <clipPath id="water-play_svg__a">
        <path d="M0 0h30v30H0z" />
      </clipPath>
      <g clipPath="url(#water-play_svg__a)">
        <path
          d="m152.971 60.296-5.617-4.998v9.997zm3-1.878 6.746 6.242 4.022-3.722 4.351 4.026 2.58-2.789-6.931-6.414-4.022 3.722-4.166-3.855zm-9.849-4.823 4.165-3.854 4.022 3.721 4.247-3.929 4.327 4.004 4.165-3.853 4.141 3.832 2.581-2.789-6.722-6.22-4.165 3.853-4.327-4.004-4.247 3.929-4.022-3.721-6.746 6.242z"
          style={{
            fill: '#fff',
          }}
          transform="translate(-143.656 -39.63)"
        />
      </g>
    </g>
  </svg>
)
export default SvgWaterPlay

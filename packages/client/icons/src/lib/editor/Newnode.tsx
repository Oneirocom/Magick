import type { SVGProps } from 'react'
const SvgNewnode = (props: SVGProps<SVGSVGElement>) => (
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
    <g transform="translate(.206)">
      <path
        d="M0 0h30v30H0z"
        style={{
          fill: 'none',
        }}
      />
      <clipPath id="newnode_svg__a">
        <path d="M0 0h30v30H0z" />
      </clipPath>
      <g clipPath="url(#newnode_svg__a)">
        <path
          d="M84.225 5.463h-7.489v19.145h19.03V16.94h-3.8v3.868h-11.43V9.263h3.689zm11.541 0V0h-3.8v5.463h-5.441v3.8h5.441v5.462h3.8V9.263h5.44v-3.8z"
          style={{
            fill: '#fff',
          }}
          transform="translate(-71.206)"
        />
      </g>
    </g>
  </svg>
)
export default SvgNewnode

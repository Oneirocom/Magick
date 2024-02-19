import type { SVGProps } from 'react'
const SvgHand = (props: SVGProps<SVGSVGElement>) => (
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
      transform="translate(.181 .63)"
    />
    <path
      d="M257.496 45.156h6.01a12.94 12.94 0 0 1 9.149 3.79v15.159h-15.099a3.85 3.85 0 0 1-3.85-3.849v-5.741a3.85 3.85 0 0 1 3.85-3.85h4.792c.46 0 .833-.372.833-.832v-.054a.833.833 0 0 0-.833-.833h-1.064a3.79 3.79 0 0 1-3.788-3.788z"
      style={{
        fill: 'none',
      }}
      transform="translate(-250.233 -39)"
    />
    <path
      d="M275.815 48.946v15.159"
      style={{
        fill: 'none',
      }}
      transform="translate(-249.928 -39)"
    />
    <path
      d="M271.988 48.946v15.159h3.8V48.946zm-16.724-3.79h6.01c3.431 0 6.722 1.364 9.148 3.79h.001v15.159h-15.1a3.85 3.85 0 0 1-3.849-3.849v-5.741a3.85 3.85 0 0 1 3.849-3.85h4.793c.46 0 .832-.372.832-.832v-.054a.83.83 0 0 0-.832-.833h-1.064a3.8 3.8 0 0 1-2.679-1.109 3.8 3.8 0 0 1-1.109-2.679zm9.482 4.486a9 9 0 0 1 1.877 1.044v9.619h-11.3a.05.05 0 0 1-.049-.049v-5.741a.05.05 0 0 1 .014-.035.05.05 0 0 1 .035-.015h4.793a4.63 4.63 0 0 0 4.632-4.632z"
      style={{
        fill: '#fff',
      }}
      transform="translate(-248 -39)"
    />
  </svg>
)
export default SvgHand

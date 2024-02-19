import type { SVGProps } from 'react'
const SvgLock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 -256 1792 1792" {...props}>
    <path
      d="M704 512q0 53-37.5 90.5T576 640t-90.5-37.5T448 512q0-37 19-67t51-47l-69-229q-5-15 5-28t26-13h192q16 0 26 13t5 28l-69 229q32 17 51 47t19 67M320 768h512v192q0 106-75 181t-181 75-181-75-75-181zm832-96V96q0-40-28-68t-68-28H96Q56 0 28 28T0 96v576q0 40 28 68t68 28h32v192q0 184 132 316t316 132 316-132 132-316V768h32q40 0 68-28t28-68"
      style={{
        fill: 'currentColor',
      }}
      transform="matrix(1 0 0 -1 318.915 1346.17)"
    />
  </svg>
)
export default SvgLock

import type { SVGProps } from 'react'
const SvgNodeLock = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path d="M10 16a2 2 0 0 1 4 0c0 .738-.404 1.376-1 1.723V20h-2v-2.277c-.596-.347-1-.985-1-1.723m11-6v14H3V10h3V6a6 6 0 0 1 12 0v4zM8 10h8V6c0-2.206-1.795-4-4-4S8 3.794 8 6zm11 2H5v10h14z" />
  </svg>
)
export default SvgNodeLock

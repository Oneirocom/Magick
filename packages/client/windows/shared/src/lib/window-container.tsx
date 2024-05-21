import React from 'react'

interface WindowContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const WindowContainer = ({
  children,
  ...props
}: WindowContainerProps) => {
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden font-sans">
      {children}
    </div>
  )
}

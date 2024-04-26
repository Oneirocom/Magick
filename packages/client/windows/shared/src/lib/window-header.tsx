import { Button, type ButtonProps } from '@magickml/client-ui'
import React from 'react'

interface WindowHeaderProps {
  title: string
  description?: string
  cta?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  headerProps?: React.HTMLAttributes<HTMLDivElement>
  ctaProps?: ButtonProps
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  description,
  cta,
  containerProps,
  headerProps,
  ctaProps,
}) => {
  return (
    <div
      className="inline-flex items-center justify-between w-full p-8"
      {...containerProps}
    >
      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-medium" {...headerProps}>
          {title}
        </h1>

        {description && <p className="text-sm">{description}</p>}
      </div>
      {cta && <Button {...ctaProps}>{cta}</Button>}
    </div>
  )
}

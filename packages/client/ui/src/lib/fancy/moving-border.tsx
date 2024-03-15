import React from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  animate = true,
  ...otherProps
}: {
  children: React.ReactNode
  duration?: number
  rx?: string
  ry?: string
  [key: string]: any
}) => {
  const pathRef = useRef<any>()
  const progress = useMotionValue<number>(0)

  useAnimationFrame(time => {
    const length = pathRef.current?.getTotalLength()
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
    }
  })

  const x = useTransform(
    progress,
    val => pathRef.current?.getPointAtLength(val).x
  )
  const y = useTransform(
    progress,
    val => pathRef.current?.getPointAtLength(val).y
  )

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      {animate && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'inline-block',
            transform,
          }}
        >
          {children}
        </motion.div>
      )}
    </>
  )
}

export const successBorderGradient =
  'bg-[radial-gradient(var(--ds-alert)_40%,transparent_60%)]'
export const errorBorderGradient =
  'bg-[radial-gradient(var(--ds-error)_40%,transparent_60%)]'
export const processingBorderGradient =
  'bg-[radial-gradient(var(--ds-primary)_40%,transparent_60%)]'
export const selectedBorderGradient =
  'bg-[radial-gradient(var(--ds-white)_40%,transparent_60%)]'

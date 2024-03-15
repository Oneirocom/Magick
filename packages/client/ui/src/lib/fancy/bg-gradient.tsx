import { cn } from '../utils/shadcn'
import { motion } from 'framer-motion'

interface BackgroundGradientProps {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  animate?: boolean
  active?: boolean
  gradient?: string
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  children,
  className,
  containerClassName,
  animate = true,
  active = true,
  gradient = successGradient,
}) => {
  const variants = {
    initial: {
      backgroundPosition: '0 50%',
    },
    animate: {
      backgroundPosition: ['0, 50%', '100% 50%', '0 50%'],
    },
  }

  return (
    <div className={cn('relative group', containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={
          animate
            ? {
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? '400% 400%' : undefined,
        }}
        className={cn(
          'absolute inset-0 rounded-xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500',
          active ? gradient : 'bg-transparent'
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? '200% 200%' : undefined,
          borderRadius: `calc(0.96 * 0.25rem)`,
        }}
        className={cn(
          'absolute inset-0 z-[1] transition duration-500',
          active ? gradient : 'bg-transparent'
        )}
      />
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  )
}

// Preset gradient strings
export const successGradient =
  'bg-[radial-gradient(circle_farthest-side_at_0_100%,#00b894,transparent),radial-gradient(circle_farthest-side_at_100%_0,#55efc4,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#81ecec,transparent),radial-gradient(circle_farthest-side_at_0_0,#55efc4,#00b894)]'

export const processingGradient =
  'bg-[radial-gradient(circle_farthest-side_at_0_100%,#1bc5eb,transparent),radial-gradient(circle_farthest-side_at_100%_0,#a29bfe,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#1bc5eb,transparent),radial-gradient(circle_farthest-side_at_0_0,#6c5ce7,#1bc5eb)]'

export const errorGradient =
  'bg-[radial-gradient(circle_farthest-side_at_0_100%,#ff7675,transparent),radial-gradient(circle_farthest-side_at_100%_0,#fab1a0,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ff7675,transparent),radial-gradient(circle_farthest-side_at_0_0,#e17055,#ff7675)]'

  export const selectedGradient = 'bg-[radial-gradient(circle_farthest-side_at_0_100%,#a29bfe,transparent),radial-gradient(circle_farthest-side_at_100%_0,#a29bfe,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#a29bfe,transparent),radial-gradient(circle_farthest-side_at_0_0,#a29bfe,#a29bfe)]'
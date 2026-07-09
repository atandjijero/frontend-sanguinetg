import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full px-6 font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:opacity-80 focus-visible:ring-primary',
        primaryContainer: 'bg-primary-container text-on-primary hover:opacity-90 focus-visible:ring-primary-container',
        secondary: 'border-2 border-secondary text-secondary bg-transparent hover:bg-secondary-container/10 focus-visible:ring-secondary',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
        cta: 'bg-primary text-on-primary hover:opacity-80 focus-visible:ring-primary',
      },
      size: {
        default: 'h-touch-target-min px-8',
        sm: 'h-10 px-4',
        lg: 'h-12 px-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={twMerge(buttonVariants({ variant, size }), className)}
        type={type}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
export default Button

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono font-bold uppercase tracking-wider rounded-none transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        // Solid brutalist block: white face, black border + hard offset shadow, lifts on hover.
        brutal:
          'border-2 border-black bg-white text-ink brut-shadow hover:-translate-x-1 hover:-translate-y-1 hover:bg-acid active:translate-x-0 active:translate-y-0',
        // Hollow block that hard-inverts on hover.
        outline:
          'border-2 border-white bg-transparent text-white hover:bg-white hover:text-ink',
        // Acid block.
        acid:
          'border-2 border-black bg-acid text-ink brut-shadow hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0',
      },
      size: {
        nav: 'px-5 py-2 text-[11px]',
        hero: 'px-10 py-4 text-sm',
        block: 'px-12 py-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'brutal',
      size: 'hero',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

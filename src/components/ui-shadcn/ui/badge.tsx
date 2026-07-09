import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/shadcn-utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-[oklch(0.922_0_0)] px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[oklch(0.708_0_0)] focus:ring-offset-2 dark:border-[oklch(1_0_0_/_10%)] dark:focus:ring-[oklch(0.556_0_0)]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[oklch(0.205_0_0)] text-[oklch(0.985_0_0)] shadow hover:bg-[oklch(0.205_0_0)]/80 dark:bg-[oklch(0.922_0_0)] dark:text-[oklch(0.205_0_0)] dark:hover:bg-[oklch(0.922_0_0)]/80",
        secondary:
          "border-transparent bg-[oklch(0.97_0_0)] text-[oklch(0.205_0_0)] hover:bg-[oklch(0.97_0_0)]/80 dark:bg-[oklch(0.269_0_0)] dark:text-[oklch(0.985_0_0)] dark:hover:bg-[oklch(0.269_0_0)]/80",
        destructive:
          "border-transparent bg-[oklch(0.577_0.245_27.325)] text-destructive-foreground shadow hover:bg-[oklch(0.577_0.245_27.325)]/80 dark:bg-[oklch(0.704_0.191_22.216)] dark:hover:bg-[oklch(0.704_0.191_22.216)]/80",
        outline: "text-[oklch(0.145_0_0)] dark:text-[oklch(0.985_0_0)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

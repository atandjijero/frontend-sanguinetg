"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/shadcn-utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-[oklch(0.922_0_0)] border-[oklch(0.205_0_0)] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[oklch(0.708_0_0)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[oklch(0.205_0_0)] data-[state=checked]:text-[oklch(0.985_0_0)] dark:border-[oklch(1_0_0_/_10%)] dark:border-[oklch(0.922_0_0)] dark:focus-visible:ring-[oklch(0.556_0_0)] dark:data-[state=checked]:bg-[oklch(0.922_0_0)] dark:data-[state=checked]:text-[oklch(0.205_0_0)]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("grid place-content-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

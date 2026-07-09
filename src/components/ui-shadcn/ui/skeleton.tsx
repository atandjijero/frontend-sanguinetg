import { cn } from "@/lib/shadcn-utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[oklch(0.205_0_0)]/10 dark:bg-[oklch(0.922_0_0)]/10", className)}
      {...props}
    />
  )
}

export { Skeleton }

"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[oklch(1_0_0)] group-[.toaster]:text-[oklch(0.145_0_0)] group-[.toaster]:border-[oklch(0.922_0_0)] group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-[oklch(0.145_0_0)] dark:group-[.toaster]:text-[oklch(0.985_0_0)] dark:group-[.toaster]:border-[oklch(1_0_0_/_10%)]",
          description: "group-[.toast]:text-[oklch(0.556_0_0)] dark:group-[.toast]:text-[oklch(0.708_0_0)]",
          actionButton:
            "group-[.toast]:bg-[oklch(0.205_0_0)] group-[.toast]:text-[oklch(0.985_0_0)] dark:group-[.toast]:bg-[oklch(0.922_0_0)] dark:group-[.toast]:text-[oklch(0.205_0_0)]",
          cancelButton:
            "group-[.toast]:bg-[oklch(0.97_0_0)] group-[.toast]:text-[oklch(0.556_0_0)] dark:group-[.toast]:bg-[oklch(0.269_0_0)] dark:group-[.toast]:text-[oklch(0.708_0_0)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

import React from 'react'

export interface TogoFlagProps extends Omit<React.SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height'> {
  size?: number
}

export function TogoFlag({ size = 24, className, ...props }: TogoFlagProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      width={size}
      height={(size * 160) / 240}
      className={`rounded-sm ${className ?? ''}`}
      role="img"
      aria-label="Drapeau du Togo"
      {...props}
    >
      <rect width="240" height="160" fill="#006a4e" />
      <rect y="32" width="240" height="32" fill="#ffce00" />
      <rect y="96" width="240" height="32" fill="#ffce00" />
      <rect width="96" height="96" fill="#d21034" />
      <polygon
        fill="#ffffff"
        points="48,20 54.29,39.35 74.63,39.35 58.17,51.31 64.45,70.65 48,58.7 31.55,70.65 37.83,51.31 21.37,39.35 41.71,39.35"
      />
    </svg>
  )
}

import React from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps): React.JSX.Element {
  const alignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'

  return (
    <div className={`${alignClass} mb-16`}>
      {eyebrow ? <div className="inline-block px-3 py-1 text-xs uppercase opacity-70 mb-2">{eyebrow}</div> : null}
      <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">{title}</h2>
      {description ? <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">{description}</p> : null}
    </div>
  )
}

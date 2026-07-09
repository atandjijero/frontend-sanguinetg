import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '../../data/faq'

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-outline-variant rounded-2xl bg-surface-container-lowest overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="font-headline-md text-base font-semibold text-on-surface">{question}</span>
        <ChevronDown
          className={`shrink-0 text-primary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          size={20}
          aria-hidden
        />
      </button>
      {open ? <p className="px-6 pb-5 text-body-md text-secondary text-justify">{answer}</p> : null}
    </div>
  )
}

export function FaqList() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq) => (
        <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  )
}

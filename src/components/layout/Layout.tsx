import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from '../sections/Footer'
import { NewsletterModal } from '../NewsletterModal'

export function Layout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <NewsletterModal />
    </div>
  )
}

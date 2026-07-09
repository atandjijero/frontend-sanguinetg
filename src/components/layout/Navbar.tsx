import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Droplet, Menu, X } from 'lucide-react'
import Button from '../ui/Button'

const links = [
  { label: 'Accueil', to: '/' },
  { label: 'Fonctionnement', to: '/fonctionnement' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-surface border-b border-surface-container-highest shadow-sm transition-all duration-300 ${
        scrolled ? 'h-16 shadow-md' : 'h-20 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full max-w-container-max mx-auto">
        <Link className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2" to="/">
          <Droplet className="fill-primary/10" size={30} aria-hidden />
          Sanguine TG
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md'
                  : 'text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/connexion"
            className="hidden sm:inline-flex text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md"
          >
            Connexion
          </Link>
          <Button variant="primary" size="sm" className="hidden sm:inline-flex rounded-lg font-label-md text-label-md" asChild>
            <Link to="/inscription">Je m'inscris</Link>
          </Button>
          <button
            className="md:hidden p-2 text-secondary"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden bg-surface border-t border-surface-container-highest px-margin-mobile py-4 flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className="text-secondary hover:text-primary transition-colors font-label-md text-label-md"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/connexion"
            className="text-secondary hover:text-primary transition-colors font-label-md text-label-md"
            onClick={() => setMobileOpen(false)}
          >
            Connexion
          </Link>
          <Button variant="primary" size="sm" className="rounded-lg font-label-md text-label-md w-full" asChild>
            <Link to="/inscription" onClick={() => setMobileOpen(false)}>
              Je m'inscris
            </Link>
          </Button>
        </div>
      ) : null}
    </nav>
  )
}

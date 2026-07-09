import React from 'react'
import { Link } from 'react-router-dom'
import { Droplet, Globe, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-surface-container-highest pt-16 pb-8 border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link className="font-headline-md text-headline-md font-bold text-primary mb-6 flex items-center gap-2" to="/">
              <Droplet size={24} aria-hidden />
              Sanguine TG
            </Link>
            <p className="text-secondary text-body-md text-justify mb-6">
              L'initiative officielle du CNTS Togo pour digitaliser et sécuriser le don de sang national.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors border border-outline-variant"
                href="#"
                aria-label="Site web"
              >
                <Globe size={18} aria-hidden />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors border border-outline-variant"
                href="mailto:contact@cnts.tg"
                aria-label="Email"
              >
                <Mail size={18} aria-hidden />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface">Plateforme</h4>
            <ul className="space-y-2">
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/a-propos">
                  À propos
                </Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/fonctionnement">
                  Fonctionnement
                </Link>
              </li>
              <li>
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                  Mentions Légales
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface">Aide</h4>
            <ul className="space-y-2">
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                  Centres de collecte
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface">Contact</h4>
            <p className="text-on-surface-variant text-body-md">
              Lomé, Togo
              <br />
              (+228) 22 21 00 00
              <br />
              contact@cnts.tg
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-caption text-secondary">
            © 2024 Centre National de Transfusion Sanguine (CNTS) Togo. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-mint" />
            <span className="text-caption font-bold text-success-mint">Système Opérationnel</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

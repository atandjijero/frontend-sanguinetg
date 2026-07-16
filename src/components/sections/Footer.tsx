import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, Mail } from 'lucide-react'
import { TogoFlag } from '../icons/TogoFlag'
import { T } from '../../context/LanguageContext'

export function Footer() {
  return (
    <footer className="bg-surface-container-highest pt-16 pb-8 border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link className="font-headline-md text-headline-md font-bold text-primary mb-6 flex items-center gap-2" to="/">
              <TogoFlag size={24} />
              Sanguine TG
            </Link>
            <p className="text-secondary text-body-md text-justify mb-6">
              <T>L'initiative officielle du CNTS Togo pour digitaliser et sécuriser le don de sang national.</T>
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
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface">
              <T>Plateforme</T>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/a-propos">
                  <T>À propos</T>
                </Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/fonctionnement">
                  <T>Fonctionnement</T>
                </Link>
              </li>
              <li>
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                  <T>Mentions Légales</T>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface">
              <T>Aide</T>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/contact">
                  <T>Contact</T>
                </Link>
              </li>
              <li>
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                  <T>Centres de collecte</T>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface">
              <T>Contact</T>
            </h4>
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
            © {new Date().getFullYear()} <T>Centre National de Transfusion Sanguine (CNTS) Togo. Tous droits réservés.</T>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-mint" />
            <span className="text-caption font-bold text-success-mint">
              <T>Système Opérationnel</T>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

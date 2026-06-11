'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileMenu({ session }: { categories: any[], session: any }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger */}
      <button onClick={() => setOpen(true)}
        className="md:hidden text-stone-500 hover:text-stone-900 transition p-1">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-14 border-b border-stone-100">
              <span className="font-display text-lg font-bold">DZ Boutique</span>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-6 py-8 space-y-1">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/products', label: 'Boutique' },
                { href: '/cart', label: 'Panier' },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-stone-700 hover:text-stone-900 border-b border-stone-50 transition">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-6 py-6 border-t border-stone-100">
              {session ? (
                <Link href="/account" onClick={() => setOpen(false)}
                  className="block w-full text-center bg-stone-900 text-white py-3 text-sm tracking-wide">
                  Mon compte
                </Link>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}
                  className="block w-full text-center bg-stone-900 text-white py-3 text-sm tracking-wide">
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
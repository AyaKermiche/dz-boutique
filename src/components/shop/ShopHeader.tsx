'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CartButton } from './CartButton'
import { signOut } from 'next-auth/react'
import { LocaleSwitcher } from './LocaleSwitcher'

type Category = { id: string; name: string; slug: string }

export default function ShopHeader({
  session,
  categories,
}: {
  session: any
  categories: Category[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      {/* HEADER */}
<header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100">        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-neutral-700 hover:text-black transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* LOGO + DESKTOP NAV */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-bold text-lg text-neutral-900 tracking-tight"
            >
              DZ Boutique
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-4">

            {/* Locale Switcher */}
            <LocaleSwitcher />

            {/* ACCOUNT ICON (RESTORED) */}
            {session ? (
              <Link
                href="/account"
                className="text-neutral-600 hover:text-black transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:block text-sm text-neutral-500 hover:text-black transition"
              >
                Connexion
              </Link>
            )}

            {/* CART */}
            <CartButton />
          </div>
        </div>
      </header>


      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* panel */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col">

            {/* top */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-100">
              <span className="font-bold text-lg">DZ Boutique</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-neutral-500"
              >
                ✕
              </button>
            </div>

            {/* categories */}
            <nav className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">
                Categories
              </p>

              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-sm text-neutral-700 border-b border-neutral-50 hover:text-black transition"
                >
                  {cat.name}
                </Link>
              ))}

              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="block mt-4 text-sm font-medium text-black"
              >
                Voir tout →
              </Link>
            </nav>

            {/* bottom auth */}
            <div className="p-5 border-t border-neutral-100">
              {session ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-black text-white py-3 text-sm"
                  >
                    Mon compte
                  </Link>

                  <button
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                    className="block w-full text-center text-sm text-neutral-500 mt-3 hover:text-red-500"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center bg-black text-white py-3 text-sm"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
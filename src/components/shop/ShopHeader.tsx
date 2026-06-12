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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
<header className="sticky top-0 z-40 border-b border-white/20 bg-white/50 backdrop-blur-2xl shadow-sm">        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Left: hamburger mobile */}
          <button onClick={() => setMenuOpen(true)}
            className="md:hidden text-neutral-500 hover:text-neutral-900 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-display text-lg font-bold text-neutral-900">
              DZ Boutique
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition">
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Center logo mobile */}
          <Link href="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2 font-display text-lg font-bold text-neutral-900">
            DZ Boutique
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {/*<button onClick={() => setSearchOpen(!searchOpen)}
              className="text-neutral-500 hover:text-neutral-900 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>*/}

            {/* Account */}
            {session ? (
              <Link href="/account" className="text-neutral-500 hover:text-neutral-900 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link href="/login" className="hidden md:block text-xs text-neutral-500 hover:text-neutral-900 transition tracking-wide">
                Connexion
              </Link>
            )}

            <LocaleSwitcher />


            {/* Cart */}
            <CartButton />
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="border-t border-neutral-100 px-4 py-3 bg-white">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 px-4 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
              />
              <button type="submit"
                className="px-4 py-2 bg-neutral-900 text-white text-sm hover:bg-neutral-700 transition">
                OK
              </button>
              <button type="button" onClick={() => setSearchOpen(false)}
                className="px-3 py-2 text-neutral-400 hover:text-neutral-900 transition text-sm">
                ✕
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-100">
              <span className="font-display font-bold text-lg">DZ Boutique</span>
              <button onClick={() => setMenuOpen(false)} className="text-neutral-400">✕</button>
            </div>

            {/* Search in mobile menu */}
            <div className="px-5 py-4 border-b border-neutral-50">
              <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false) }}
                className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900 rounded"
                />
                <button type="submit"
                  className="px-3 py-2 bg-neutral-900 text-white text-sm rounded">
                  🔍
                </button>
              </form>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
                  Categories
                </p>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-sm text-neutral-700 border-b border-neutral-50 hover:text-neutral-900 transition">
                    {cat.name}
                    <span className="text-neutral-300">→</span>
                  </Link>
                ))}
                <Link href="/products" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-medium text-neutral-900 border-b border-neutral-50">
                  Voir tout
                  <span className="text-neutral-300">→</span>
                </Link>
              </div>
            </nav>

            <div className="p-5 border-t border-neutral-100 space-y-2">
              {session ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-neutral-900 text-white py-3 text-sm tracking-wide">
                    Mon compte
                  </Link>
                  <button onClick={() => { signOut(); setMenuOpen(false) }}
                    className="block w-full text-center text-sm text-neutral-400 hover:text-red-500 transition py-2">
                    Deconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-neutral-900 text-white py-3 text-sm tracking-wide">
                    Connexion
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}
                    className="block w-full text-center border border-neutral-200 text-neutral-700 py-3 text-sm">
                    Creer un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
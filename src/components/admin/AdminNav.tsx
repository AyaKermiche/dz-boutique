'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/products', label: 'Produits', icon: '👗' },
  { href: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { href: '/admin/orders', label: 'Commandes', icon: '📦' },
  { href: '/admin/profile', label: 'Parametres', icon: '⚙️' },
]

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map(item => (
        <Link key={item.href} href={item.href}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
            isActive(item.href, item.exact)
              ? 'bg-gray-100 text-gray-900 font-medium'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}>
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-gray-900">Admin</span>
        <div className="w-9" />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">DZ Boutique Admin</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400">✕</button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <NavLinks />
            </nav>
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2 truncate">{email}</p>
              <button
  onClick={() => signOut({ callbackUrl: '/login' })}
  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
>
  🚪 Deconnexion
</button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 bg-white border-r border-gray-100 flex-col">
        <div className="p-5 border-b border-gray-100">
          <p className="font-bold text-gray-900">DZ Boutique</p>
          <p className="text-xs text-gray-400 mt-1">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-3 truncate">{email}</p>
          <button
  onClick={() => signOut({ callbackUrl: '/login' })}
  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
>
  🚪 Deconnexion
</button>
        </div>
      </aside>
    </>
  )
}
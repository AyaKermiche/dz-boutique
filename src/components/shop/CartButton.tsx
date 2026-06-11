'use client'

import { useCart } from '@/lib/cart'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function CartButton() {
  const { items, count, total, removeItem, updateQuantity } = useCart()
  const [open, setOpen] = useState(false)
  const itemCount = count()

  return (
    <>
      {/* Cart icon */}
      <button onClick={() => setOpen(true)}
        className="relative text-neutral-500 hover:text-neutral-900 transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h2 className="font-display font-bold text-lg text-neutral-900">
                Panier {itemCount > 0 && `(${itemCount})`}
              </h2>
              <button onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 transition text-xl">
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="text-5xl mb-4">🛍️</div>
                  <p className="font-medium text-neutral-900 mb-1">Votre panier est vide</p>
                  <p className="text-sm text-neutral-400 mb-6">Ajoutez des produits pour commencer</p>
                  <button onClick={() => setOpen(false)}
                    className="bg-neutral-900 text-white px-6 py-3 text-sm tracking-wide hover:bg-neutral-700 transition">
                    Continuer mes achats
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-50">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 p-4">
                      <div className="w-18 h-24 bg-neutral-100 relative flex-shrink-0 overflow-hidden"
                        style={{ width: '72px' }}>
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">👗</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 leading-snug mb-1 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm font-bold text-neutral-900 mb-3">
                          {item.price.toLocaleString()} DA
                        </p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-900 transition">
                            −
                          </button>
                          <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-900 transition">
                            +
                          </button>
                          <button onClick={() => removeItem(item.id)}
                            className="ml-auto text-xs text-neutral-400 hover:text-red-500 transition">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Total</span>
                  <span className="font-bold text-lg text-neutral-900">
                    {total().toLocaleString()} DA
                  </span>
                </div>
                <Link href="/checkout" onClick={() => setOpen(false)}
                  className="block w-full bg-neutral-900 text-white text-center py-4 text-sm tracking-widest uppercase hover:bg-neutral-700 transition">
                  Commander
                </Link>
                <button onClick={() => setOpen(false)}
                  className="block w-full text-center text-sm text-neutral-400 hover:text-neutral-900 transition py-1">
                  Continuer mes achats
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
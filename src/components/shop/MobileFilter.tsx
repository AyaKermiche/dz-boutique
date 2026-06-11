'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Category = { id: string; name: string; slug: string }

export default function MobileFilter({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  function apply() {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('min', minPrice)
    else params.delete('min')
    if (maxPrice) params.set('max', maxPrice)
    else params.delete('max')
    router.push(`/products?${params.toString()}`)
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-xs text-neutral-600 hover:border-neutral-900 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 4h18M7 12h10M11 20h2" />
        </svg>
        Filtrer
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-neutral-900">Filtres</h3>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-900">✕</button>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
                Prix (DA)
              </p>
              <div className="flex gap-3 items-center">
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900" />
                <span className="text-neutral-400">—</span>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => {
                setMinPrice('')
                setMaxPrice('')
                router.push('/products')
                setOpen(false)
              }}
                className="flex-1 border border-neutral-200 text-neutral-600 py-3 text-sm hover:border-neutral-900 transition">
                Reinitialiser
              </button>
              <button onClick={apply}
                className="flex-1 bg-neutral-900 text-white py-3 text-sm hover:bg-neutral-700 transition">
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
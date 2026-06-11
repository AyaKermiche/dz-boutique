'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

type Category = { id: string; name: string; slug: string }

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') ?? '')

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`/products?${params.toString()}`)
  }, [searchParams, router])

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
          Recherche
        </label>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateParams({ search })}
            placeholder="Nom du produit..."
            className="flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black"
          />
          <button onClick={() => updateParams({ search })}
            className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 transition">
            🔍
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
          Catégorie
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateParams({ category: '' })}
            className={`block w-full text-left px-3 py-2 text-sm rounded transition ${
              !searchParams.get('category') ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            Tout
          </button>
          {categories.map((cat) => (
            <button key={cat.id}
              onClick={() => updateParams({ category: cat.slug })}
              className={`block w-full text-left px-3 py-2 text-sm rounded transition ${
                searchParams.get('category') === cat.slug ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
          Prix (DA)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <button
          onClick={() => updateParams({ min: minPrice, max: maxPrice })}
          className="mt-2 w-full border border-gray-200 text-gray-600 py-2 text-sm hover:border-black hover:text-black transition">
          Appliquer
        </button>
      </div>

      {/* Reset */}
      {(searchParams.get('search') || searchParams.get('category') || searchParams.get('min') || searchParams.get('max')) && (
        <button
          onClick={() => router.push('/products')}
          className="w-full text-xs text-red-400 hover:text-red-600 transition">
          Réinitialiser les filtres ✕
        </button>
      )}
    </div>
  )
}
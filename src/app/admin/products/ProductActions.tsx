'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export function ProductActions({ productId, isActive }: {
  productId: string
  isActive: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleActive() {
    await fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    router.refresh()
  }

  async function deleteProduct() {
    if (!confirm('Supprimer ce produit definitivement ?')) return
    setLoading(true)
    await fetch(`/api/products/${productId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-1 flex-shrink-0">
      <Link href={`/admin/products/${productId}/edit`}
        className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 hover:border-black hover:text-black transition text-center rounded">
        Modifier
      </Link>
      <button onClick={toggleActive}
        className={`px-3 py-1.5 text-xs border transition rounded ${
          isActive
            ? 'border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'
            : 'border-green-200 text-green-600 hover:bg-green-50'
        }`}>
        {isActive ? 'Masquer' : 'Afficher'}
      </button>
      <button onClick={deleteProduct} disabled={loading}
        className="px-3 py-1.5 text-xs border border-red-100 text-red-400 hover:border-red-400 hover:text-red-600 transition rounded disabled:opacity-50">
        {loading ? '...' : 'Supprimer'}
      </button>
    </div>
  )
}
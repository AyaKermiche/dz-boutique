'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ImageUploader } from '@/components/admin/ImageUploader'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [editName, setEditName] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])

  async function fetchCategories() {
    const res = await fetch('/api/categories')
    setCategories(await res.json())
    setFetching(false)
  }

  useEffect(() => { fetchCategories() }, [])

  async function handleAdd(e: React.FormEvent) {
  e.preventDefault()

  console.log("Images:", images)
  console.log("Image sent:", images[0])

  await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      image: images[0] || null
    }),
  })
}

  /*async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image: images[0] || null }),
    })
    setName('')
    setImages([])
    setLoading(false)
    fetchCategories()
  }*/

  async function handleEdit(id: string) {
    await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, image: editImages[0] || null }),
    })
    setEditing(null)
    fetchCategories()
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette categorie ? Les produits associes seront aussi supprimes.')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Categories</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 space-y-4">
        <h2 className="font-medium text-gray-900">Nouvelle categorie</h2>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nom *</label>
          <input value={name} onChange={e => setName(e.target.value)} required
            placeholder="Ex: Robes, Jeans..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Image de la categorie</label>
          <ImageUploader value={images} onChange={setImages} max={1} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
          {loading ? '...' : 'Ajouter la categorie'}
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {fetching ? (
          <p className="text-center text-gray-400 text-sm py-8">Chargement...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">Aucune categorie</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {categories.map(cat => (
              <li key={cat.id}>
                {editing?.id === cat.id ? (
                  <div className="p-4 space-y-3">
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                    <ImageUploader value={editImages} onChange={setEditImages} max={1} />
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(cat.id)}
                        className="flex-1 bg-black text-white py-2 rounded-lg text-sm">
                        Sauvegarder
                      </button>
                      <button onClick={() => setEditing(null)}
                        className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🗂️</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                      <p className="text-xs text-gray-400">{cat._count?.products ?? 0} produit(s)</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setEditing(cat)
                        setEditName(cat.name)
                        setEditImages(cat.image ? [cat.image] : [])
                      }}
                        className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 hover:border-black rounded transition">
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(cat.id)}
                        className="px-3 py-1.5 text-xs border border-red-100 text-red-400 hover:border-red-400 rounded transition">
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
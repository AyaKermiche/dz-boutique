'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ImageUploader } from '@/components/admin/ImageUploader'

const PRESET_COLORS = [
  { name: 'Noir', hex: '#000000' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Beige', hex: '#D4B896' },
  { name: 'Marron', hex: '#8B4513' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Rouge', hex: '#DC2626' },
  { name: 'Rose', hex: '#F472B6' },
  { name: 'Bleu', hex: '#2563EB' },
  { name: 'Vert', hex: '#16A34A' },
  { name: 'Jaune', hex: '#EAB308' },
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Violet', hex: '#9333EA' },
  { name: 'Marine', hex: '#1E3A5F' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Bordeaux', hex: '#800020' },
]

const PRESET_SIZES_CLOTHES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const PRESET_SIZES_SHOES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [images, setImages] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '', price: '', stock: '', description: '', categoryId: '', isActive: true,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([product, cats]) => {
      setForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        categoryId: product.categoryId,
        isActive: product.isActive,
      })
      setImages(product.images || [])
      setSizes(product.sizes || [])
      setColors(product.colors || [])
      setCategories(cats)
      setFetching(false)
    })
  }, [id])

  function toggleSize(size: string) {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  function toggleColor(color: string) {
    setColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images,
        sizes,
        colors,
      }),
    })

    if (res.ok) {
      router.push('/admin/products')
    } else {
      setError('Erreur lors de la modification')
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-8 text-center text-gray-400">Chargement...</div>
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-900">← Retour</button>
        <h1 className="text-xl font-semibold text-gray-900">Modifier le produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-4">Photos</h2>
          <ImageUploader value={images} onChange={setImages} max={5} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-medium text-gray-900 mb-2">Informations</h2>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Prix (DA) *</label>
              <input type="number" value={form.price}
                onChange={e => setForm({...form, price: e.target.value})} required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock *</label>
              <input type="number" value={form.stock}
                onChange={e => setForm({...form, stock: e.target.value})} required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Categorie *</label>
            <select value={form.categoryId}
              onChange={e => setForm({...form, categoryId: e.target.value})} required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea rows={3} value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive}
              onChange={e => setForm({...form, isActive: e.target.checked})}
              className="w-4 h-4" />
            <label htmlFor="isActive" className="text-sm text-gray-600">
              Produit visible sur le shop
            </label>
          </div>
        </div>

        {/* Tailles */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-4">Tailles</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_SIZES_CLOTHES.concat(PRESET_SIZES_SHOES).map(size => (
              <button key={size} type="button" onClick={() => toggleSize(size)}
                className={`min-w-[44px] h-10 px-3 border text-sm transition ${
                  sizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700 hover:border-black'
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-4">Couleurs</h2>
          <div className="grid grid-cols-5 gap-3">
            {PRESET_COLORS.map(color => (
              <button key={color.name} type="button" onClick={() => toggleColor(color.name)}
                className="flex flex-col items-center gap-1">
                <div style={{ backgroundColor: color.hex }}
                  className={`w-10 h-10 rounded-full border-2 transition flex items-center justify-center ${
                    colors.includes(color.name) ? 'border-black scale-110' : 'border-transparent'
                  } ${color.hex === '#FFFFFF' ? 'border-gray-200' : ''}`}>
                  {colors.includes(color.name) && (
                    <span className={`text-xs font-bold ${color.hex === '#FFFFFF' || color.hex === '#EAB308' ? 'text-gray-800' : 'text-white'}`}>✓</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
          {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </button>
      </form>
    </div>
  )
}
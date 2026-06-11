'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [images, setImages] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [customSize, setCustomSize] = useState('')
  const [sizeType, setSizeType] = useState<'clothes' | 'shoes' | 'custom'>('clothes')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  function toggleSize(size: string) {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  function toggleColor(color: string) {
    setColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])
  }

  function addCustomSize() {
    const v = customSize.trim().toUpperCase()
    if (v && !sizes.includes(v)) setSizes(prev => [...prev, v])
    setCustomSize('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: getValue('name'),
        price: parseFloat(getValue('price')),
        stock: parseInt(getValue('stock')),
        description: getValue('description'),
        categoryId: getValue('categoryId'),
        images,
        sizes,
        colors,
        isActive: true,
      }),
    })

    if (res.ok) {
      router.push('/admin/products')
    } else {
      const err = await res.json()
      setError(err.error || 'Erreur')
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-900 transition">
          ← Retour
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Nouveau produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-4">Photos du produit</h2>
          <ImageUploader value={images} onChange={setImages} max={5} />
        </div>

        {/* Infos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-medium text-gray-900 mb-2">Informations</h2>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom du produit *</label>
            <input name="name" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ex: Robe d'ete fleurie" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Prix (DA) *</label>
              <input name="price" type="number" required min="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="2500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock *</label>
              <input name="stock" type="number" required min="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="10" />
            </div>
          </div>

<div> 
  <label className="block text-sm text-gray-600 mb-1">Categorie *</label> 
  <select name="categoryId" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"> 
    <option value="">Choisir...</option> 
    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} </select> 
  </div>


          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea name="description" rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Decrivez le produit..." />
          </div>
        </div>

        {/* Tailles */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-4">Tailles disponibles</h2>

          <div className="flex gap-2 mb-4">
            {(['clothes', 'shoes', 'custom'] as const).map(type => (
              <button key={type} type="button"
                onClick={() => { setSizeType(type); setSizes([]) }}
                className={`px-3 py-1.5 text-xs border rounded-full transition ${
                  sizeType === type ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600'
                }`}>
                {type === 'clothes' ? 'Vetements' : type === 'shoes' ? 'Chaussures' : 'Personnalise'}
              </button>
            ))}
          </div>

          {sizeType === 'clothes' && (
            <div className="flex flex-wrap gap-2">
              {PRESET_SIZES_CLOTHES.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`min-w-[48px] h-10 px-3 border text-sm transition ${
                    sizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700 hover:border-black'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          )}

          {sizeType === 'shoes' && (
            <div className="flex flex-wrap gap-2">
              {PRESET_SIZES_SHOES.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`min-w-[48px] h-10 px-3 border text-sm transition ${
                    sizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700 hover:border-black'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          )}

          {sizeType === 'custom' && (
            <div>
              <div className="flex gap-2 mb-3">
                <input value={customSize} onChange={e => setCustomSize(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                  placeholder="Ex: Unique, 42/44..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                <button type="button" onClick={addCustomSize}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <span key={s} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {s}
                    <button type="button" onClick={() => setSizes(sizes.filter(x => x !== s))}
                      className="text-gray-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {sizes.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">Aucune taille = pas de selection pour le client</p>
          )}
        </div>

        {/* Couleurs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-900 mb-4">Couleurs disponibles</h2>
          <div className="grid grid-cols-5 gap-3">
            {PRESET_COLORS.map(color => (
              <button key={color.name} type="button" onClick={() => toggleColor(color.name)}
                className="flex flex-col items-center gap-1 group">
                <div
                  style={{ backgroundColor: color.hex }}
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    colors.includes(color.name)
                      ? 'border-black scale-110'
                      : 'border-transparent group-hover:border-gray-300'
                  } ${color.hex === '#FFFFFF' ? 'border-gray-200' : ''}`}>
                  {colors.includes(color.name) && (
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <span className={`text-xs font-bold ${color.hex === '#FFFFFF' || color.hex === '#EAB308' ? 'text-gray-800' : 'text-white'}`}>✓</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">{color.name}</span>
              </button>
            ))}
          </div>
          {colors.length === 0 && (
            <p className="text-xs text-gray-400 mt-3">Aucune couleur = pas de selection pour le client</p>
          )}
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
          {loading ? 'Creation...' : 'Creer le produit'}
        </button>
      </form>
    </div>
  )
}
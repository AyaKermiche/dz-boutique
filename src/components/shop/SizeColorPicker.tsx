'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

const COLOR_MAP: Record<string, string> = {
  'Noir': '#000000',
  'Blanc': '#FFFFFF',
  'Beige': '#D4B896',
  'Marron': '#8B4513',
  'Gris': '#808080',
  'Rouge': '#DC2626',
  'Rose': '#F472B6',
  'Bleu': '#2563EB',
  'Vert': '#16A34A',
  'Jaune': '#EAB308',
  'Orange': '#EA580C',
  'Violet': '#9333EA',
  'Marine': '#1E3A5F',
  'Camel': '#C19A6B',
  'Bordeaux': '#800020',
}

type Product = {
  id: string
  name: string
  price: number
  image: string
  slug: string
  stock: number
}

type Props = {
  sizes: string[]
  colors: string[]
  isSoldOut: boolean
  product: Product
  whatsappNumber: string
}

export function SizeColorPicker({ sizes, colors, isSoldOut, product, whatsappNumber }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')
  const addItem = useCart(s => s.addItem)
  const router = useRouter()

  const needsSize = sizes.length > 0
  const needsColor = colors.length > 0
  const isValid = (!needsSize || selectedSize) && (!needsColor || selectedColor)

  function validate() {
    if (needsSize && !selectedSize) {
      setError('Veuillez choisir une taille')
      return false
    }
    if (needsColor && !selectedColor) {
      setError('Veuillez choisir une couleur')
      return false
    }
    setError('')
    return true
  }

  function buildLabel() {
    const parts = []
    if (selectedSize) parts.push(selectedSize)
    if (selectedColor) parts.push(selectedColor)
    return parts.length > 0 ? ` - ${parts.join(' / ')}` : ''
  }

  function handleAddToCart() {
    if (!validate()) return
    addItem({
      ...product,
      name: `${product.name}${buildLabel()}`,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleWhatsApp() {
    if (!validate()) return
    const text = `Bonjour, je veux commander:\n*${product.name}${buildLabel()}*\nPrix: ${product.price.toLocaleString()} DA`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
  }

  function handleDirectOrder() {
    if (!validate()) return
    addItem({
      ...product,
      name: `${product.name}${buildLabel()}`,
      quantity: 1,
    })
    router.push('/checkout')
  }

  if (isSoldOut) {
    return (
      <div className="space-y-3">
        <div className="w-full py-4 text-sm tracking-widest uppercase bg-neutral-100 text-neutral-400 text-center">
          Rupture de stock
        </div>
        <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour, est-ce que ${product.name} sera disponible bientôt ?`)}`}
          target="_blank"
          className="flex items-center justify-center gap-2 w-full border border-neutral-200 text-neutral-600 py-3 text-sm hover:border-neutral-900 transition">
          Me prevenir sur WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Sizes */}
      {needsSize && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-700">
              Taille {selectedSize && <span className="text-neutral-400 normal-case">— {selectedSize}</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button key={size} type="button"
                onClick={() => { setSelectedSize(size); setError('') }}
                className={`min-w-[44px] h-11 px-3 border text-sm transition ${
                  selectedSize === size
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-900'
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors — cercles */}
      {needsColor && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-700">
              Couleur {selectedColor && <span className="text-neutral-400 normal-case">— {selectedColor}</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map(color => {
              const hex = COLOR_MAP[color] ?? '#ccc'
              const isLight = ['#FFFFFF', '#EAB308', '#D4B896', '#C19A6B'].includes(hex)
              return (
                <button key={color} type="button"
                  onClick={() => { setSelectedColor(color); setError('') }}
                  title={color}
                  className="flex flex-col items-center gap-1">
                  <div
                    style={{ backgroundColor: hex }}
                    className={`w-9 h-9 rounded-full transition border-2 flex items-center justify-center ${
                      selectedColor === color
                        ? 'border-neutral-900 scale-110'
                        : isLight
                        ? 'border-neutral-300 hover:border-neutral-500'
                        : 'border-transparent hover:border-neutral-400'
                    }`}>
                    {selectedColor === color && (
                      <span className={`text-xs font-bold ${isLight ? 'text-neutral-800' : 'text-white'}`}>
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500">{color}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">{error}</p>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-2">
        {/* Add to cart */}
        <button onClick={handleAddToCart}
          className={`w-full py-4 text-sm tracking-widest uppercase transition-all ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-neutral-900 text-white hover:bg-neutral-700'
          }`}>
          {added ? '✓ Ajoute au panier' : 'Ajouter au panier'}
        </button>

        {/* Direct order */}
        <button onClick={handleDirectOrder}
          className="w-full py-4 text-sm tracking-widest uppercase border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition">
          Commander maintenant
        </button>

        {/* WhatsApp */}
        {/*<button onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 w-full border border-neutral-200 text-neutral-600 py-3 text-sm hover:border-green-500 hover:text-green-600 transition">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.529 5.858L.057 23.43a.75.75 0 00.918.919l5.633-1.474A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.497-5.2-1.366l-.373-.217-3.876 1.015 1.034-3.775-.236-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Commander via WhatsApp
        </button>*/}
      </div>
    </div>
  )
}
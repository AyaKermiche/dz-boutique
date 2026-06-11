'use client'
import { useCart } from '@/lib/cart'
import { useState } from 'react'

type Props = {
  product: {
    id: string
    name: string
    price: number
    image: string
    slug: string
    stock: number
  }
}

export function AddToCartButton({ product }: Props) {
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({ ...product, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock === 0) {
    return (
      <button disabled
        className="w-full py-4 text-sm tracking-widest uppercase bg-stone-100 text-stone-400 cursor-not-allowed">
        Rupture de stock
      </button>
    )
  }

  return (
    <button onClick={handleAdd}
      className={`w-full py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-stone-900 text-white hover:bg-stone-700'
      }`}>
      {added ? '✓ Ajoute au panier' : 'Ajouter au panier'}
    </button>
  )
}
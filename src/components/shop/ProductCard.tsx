import Link from 'next/link'
import Image from 'next/image'

type Product = {
  id: string
  name: string
  slug: string
  price: any
  images: string[]
  stock: number
  createdAt: Date
  category: { name: string }
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image container — 3:4 ratio */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-3">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-700 ease-out"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        /*new not sure if here*/
        // Dans ProductCard, après le bloc image :
{Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
  <div className="absolute top-2 left-2 bg-neutral-900 text-white text-xs px-2 py-1 rounded-full">
    Nouveau
  </div>
)}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-stone-500 bg-white px-3 py-1">
              Rupture
            </span>
          </div>
        )}

        {/* Quick add — visible on hover desktop */}
        <div className="absolute bottom-0 left-0 right-0 bg-stone-900 text-white text-center py-3 text-xs tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition duration-300 hidden md:block">
          Voir le produit
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <p className="text-xs text-stone-400 mb-1 tracking-wide">{product.category.name}</p>
        <p className="text-sm font-medium text-stone-900 leading-snug line-clamp-2 mb-1">
          {product.name}
        </p>
        <p className="text-sm font-bold text-stone-900">
          {Number(product.price).toLocaleString()} DA
        </p>
      </div>
    </Link>
  )
}
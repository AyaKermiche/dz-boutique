import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { ProductActions } from './ProductActions'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: category ? { category: { slug: category } } : {},
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="p-4 pt-20 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Produits ({products.length})
        </h1>
        <Link href="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
          + Ajouter
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <Link href="/admin/products"
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs border transition ${
            !category ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600'
          }`}>
          Tout
        </Link>
        {categories.map(cat => (
          <Link key={cat.id} href={`/admin/products?category=${cat.slug}`}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs border transition ${
              category === cat.slug ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600'
            }`}>
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">👗</p>
          <p className="text-gray-400 text-sm mb-4">Aucun produit dans cette categorie</p>
          <Link href="/admin/products/new"
            className="inline-block bg-black text-white px-4 py-2 rounded-lg text-sm">
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {products.map(product => (
            <div key={product.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👗</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                <p className="text-xs text-gray-400">{product.category.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-gray-900">
                    {Number(product.price).toLocaleString()} DA
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    product.stock === 0
                      ? 'bg-red-100 text-red-600'
                      : product.stock < 5
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {product.stock === 0 ? 'Epuise' : `${product.stock} en stock`}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <ProductActions productId={product.id} isActive={product.isActive} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
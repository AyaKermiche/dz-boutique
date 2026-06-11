import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/shop/ProductCard'
import { Suspense } from 'react'
import MobileFilter from '@/components/shop/MobileFilter'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type SearchParams = Promise<{
  category?: string
  search?: string
  min?: string
  max?: string
  sort?: string
}>

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations()
  const { category, search, min, max, sort } = await searchParams

  const orderBy = sort === 'price_asc'
    ? { price: 'asc' as const }
    : sort === 'price_desc'
    ? { price: 'desc' as const }
    : { createdAt: 'desc' as const }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
        ...(min || max ? {
          price: {
            ...(min ? { gte: parseFloat(min) } : {}),
            ...(max ? { lte: parseFloat(max) } : {}),
          }
        } : {}),
      },
      include: { category: true },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const activeCategory = categories.find(c => c.slug === category)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-neutral-900">
          {activeCategory ? activeCategory.name : t('nav.shop')}
        </h1>
        <p className="text-sm text-neutral-400 mt-1">{products.length} {products.length > 1 ? t('common.articles_plural') : t('common.articles')} </p>
      </div>

      {/* Category pills — horizontal scroll mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        <Link href="/products"
          className={`flex-shrink-0 px-4 py-2 text-xs border transition ${
            !category ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 text-neutral-600 hover:border-neutral-900'
          }`}>
          {t('common.all')}
        </Link>
        {categories.map(cat => (
          <Link key={cat.id}
            href={`/products?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`}
            className={`flex-shrink-0 px-4 py-2 text-xs border transition ${
              category === cat.slug ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 text-neutral-600 hover:border-neutral-900'
            }`}>
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Sort bar */}
      <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <Suspense>
            <MobileFilter categories={categories} />
          </Suspense>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 hidden md:block">{t('common.sort')} :</span>
          <div className="flex gap-1">
            {[
              { value: '', label: t('common.recent') },
{ value: 'price_asc', label: t('common.price_asc') },
{ value: 'price_desc', label: t('common.price_desc') },
            ].map(option => (
              <Link key={option.value}
                href={`/products?${category ? `category=${category}&` : ''}sort=${option.value}`}
                className={`px-3 py-1.5 text-xs border transition ${
                  (sort ?? '') === option.value
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-900'
                }`}>
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <Suspense>
        <SearchBar defaultValue={search} category={category} sort={sort} />
      </Suspense>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-neutral-400 text-sm">{t('common.none_found')}</p>
          <Link href="/products" className="mt-4 inline-block text-xs text-neutral-900 underline">
             {t('common.see_all')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function SearchBar({ defaultValue, category, sort }: {
  defaultValue?: string
  category?: string
  sort?: string
}) {
  return (
    <form className="mb-6" action="/products" method="GET">
      {category && <input type="hidden" name="category" value={category} />}
      {sort && <input type="hidden" name="sort" value={sort} />}
      <div className="flex gap-2">
        <input
          name="search"
          defaultValue={defaultValue}
          placeholder="Rechercher un produit..."
          className="flex-1 px-4 py-2.5 border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900 bg-white"
        />
        <button type="submit"
          className="px-4 py-2.5 bg-neutral-900 text-white text-sm hover:bg-neutral-700 transition">
          🔍
        </button>
        {defaultValue && (
          <a href={`/products${category ? `?category=${category}` : ''}`}
            className="px-4 py-2.5 border border-neutral-200 text-sm text-neutral-500 hover:border-neutral-900 transition">
            ✕
          </a>
        )}
      </div>
    </form>
  )
}
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/shop/ProductCard'
import { CategorySlider } from '@/components/shop/CategorySlider'
import Image from 'next/image'

export default async function HomePage() {
  const t = await getTranslations()

  const [categories, newProducts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),

    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),
  ])

  return (
    <>
      {/* HERO */}
  <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
  {/* Background image */}
  <div className="absolute inset-0">
    <Image
      src="/shop/dz-boutique.jpg"
      alt="Hero"
      fill
      priority
      className="object-cover object-center scale-105 md:scale-100"
    />
    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-2xl text-center px-4">
    <p className="text-xs tracking-[0.35em] uppercase text-white/70 mb-4">
      {t('home.badge')}
    </p>

    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
      {t('home.hero_title')}
    </h1>

    <p className="mt-4 text-sm md:text-base text-white/70">
      {t('home.hero_sub')}
    </p>

    <Link
      href="/products"
      className="inline-block mt-8 bg-white text-black px-7 py-3 text-sm font-medium rounded-full hover:scale-105 transition"
    >
      {t('home.hero_btn')}
    </Link>
  </div>
</section>

      {/* NEW PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
        {t('home.new_title')}
      </h2>
      <p className="text-sm text-neutral-400 mt-1">
        {t('home.new_sub')}
      </p>
    </div>

    <Link
      href="/products"
      className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border-b border-neutral-300"
    >
      {t('home.new_all')}
    </Link>
  </div>

  {/* ONLY 2 PRODUCTS */}
  <div className="grid grid-cols-2 gap-4 md:gap-8">
    {newProducts.slice(0, 2).map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 py-14">
  <div className="text-center mb-8">
    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
      {t('home.categories_title')}
    </h2>
    <p className="text-sm text-neutral-400 mt-2">
      {t('home.categories_sub')}
    </p>
  </div>

  <CategorySlider categories={categories} />
</section>

      {/* TRUST */}
      <section className="border-t py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-center text-sm">
          <div>
            <p className="font-semibold">Livraison</p>
            <p className="text-neutral-500">Dans toute l’Algérie</p>
          </div>
          <div>
            <p className="font-semibold">Paiement</p>
            <p className="text-neutral-500">À la livraison</p>
          </div>
          <div>
            <p className="font-semibold">Support</p>
            <p className="text-neutral-500">WhatsApp rapide</p>
          </div>
        </div>
      </section>
    </>
  )
}
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { SizeColorPicker } from '@/components/shop/SizeColorPicker'
//import { QuickOrderButton } from '@/components/shop/QuickOrderButton'
import { getTranslations } from 'next-intl/server'
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const t = await getTranslations()
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product || !product.isActive) notFound()

  const isSoldOut = product.stock === 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-900 transition">{t('nav.home')}</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-neutral-900 transition">{t('nav.shop')}</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`}
          className="hover:text-neutral-900 transition">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-neutral-600 truncate max-w-32">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} isSoldOut={isSoldOut} />

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-3">
            {product.category.name}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-neutral-900 mb-2">
            {Number(product.price).toLocaleString()}
            <span className="text-base font-normal text-neutral-500 ml-1">{t('common.da')}</span>
          </p>

          {/* Stock indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${
              isSoldOut ? 'bg-red-400' : product.stock < 5 ? 'bg-amber-400' : 'bg-green-500'
            }`} />
            <p className="text-xs text-neutral-500">
              {isSoldOut
                ? t('product.sold_out')
                : product.stock < 5
                ? t('product.low_stock', { count: product.stock })
                : t('product.in_stock')}
            </p>
          </div>

          {product.description && (
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 pb-6 border-b border-neutral-100">
              {product.description}
            </p>
          )}

          {/* Size & Color — client component pour gérer la validation */}
          <SizeColorPicker
            sizes={product.sizes}
            colors={product.colors}
            isSoldOut={isSoldOut}
            product={{
              id: product.id,
              name: product.name,
              price: Number(product.price),
              image: product.images[0] ?? '',
              slug: product.slug,
              stock: product.stock,
            }}
            whatsappNumber="213XXXXXXXXX"
          />

          {/* Reassurance */}
          <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-3">
            {[
  { icon: '🚚', text: t('product.delivery') },
  { icon: '💵', text: t('product.payment') },
  { icon: '📦', text: t('product.packaging') },
  { icon: '📱', text: t('product.support') },
].map(item => (
              <div key={item.text} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="text-xs text-neutral-500">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
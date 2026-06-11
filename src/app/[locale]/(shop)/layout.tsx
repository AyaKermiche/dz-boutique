import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ShopHeader from '@/components/shop/ShopHeader'
import { getTranslations } from 'next-intl/server'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations()
  const [session, categories] = await Promise.all([
    auth(),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* TOP BAR */}
      <div className="bg-neutral-900 text-white text-center py-2 px-4 text-xs tracking-[0.2em] uppercase">
        {t('home.usp_delivery')} · {t('home.usp_payment_sub')}
      </div>
    

      <ShopHeader session={session} categories={categories} />

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-900 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-2xl mb-3">DZ Boutique</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-4">{t('footer.nav')}</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <a key={cat.id} href={`/products?category=${cat.slug}`}
                    className="block text-sm text-neutral-300 hover:text-white transition">
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-4">{t('footer.contact')}</h4>
              <div className="space-y-2">
                <a href="https://wa.me/213XXXXXXXXX" target="_blank"
                  className="block text-sm text-neutral-300 hover:text-white transition">WhatsApp</a>
                <a href="https://instagram.com" target="_blank"
                  className="block text-sm text-neutral-300 hover:text-white transition">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-700 pt-6 text-center">
            <p className="text-xs text-neutral-500">© 2025 DZ Boutique · {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}